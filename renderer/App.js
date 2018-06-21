import React from 'react';
import './styles.scss';
import debounce from 'lodash/debounce';
import battery from './battery';
import io from './io';
import ScrollArea from './common/ScrollArea/ScrollArea';
import Container from './common/Container/Container';
import { WindowContext, WindowProvider } from './common/context/WindowContext';
import ErrorBoundary from './common/ErrorBoundary';
import ExpansionPanelConditional from './common/ExpansionPanelConditional/ExpansionPanelConditional';
import TableForRawData from './TableForRawData/TableForRawData';
import LiveData from './LiveData/LiveData';

// Material UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import LinearProgress from '@material-ui/core/LinearProgress';

const DEFAULT_INTERVAL = 5 * 60 * 1000;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      stats: null,
      interval: null,
      intervalMs: DEFAULT_INTERVAL,
      intervalToDisplay: DEFAULT_INTERVAL / 1000 / 60,
      samples: [],
      history: null
    };
    this.run = this.run.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.restart = this.restart.bind(this);
    this.updateInterval = this.updateInterval.bind(this);
    this.persistSamples = this.persistSamples.bind(this);
  }
  componentDidMount() {
    io.initSessionFile();
    this.run();
    this.start();
    io.getStats()
      .then(history => this.setState({ history }))
      .catch(err => console.error(err));
  }
  componentWillUnmount() {
    this.stop();
  }
  start() {
    if (!this.state.interval && this.state.intervalMs)
      this.setState({ interval: setInterval(this.run, this.state.intervalMs) });
  }
  stop(cb) {
    if (this.state.interval)
      if (typeof cb === 'function')
        this.setState({ interval: clearInterval(this.state.interval) }, cb);
      else
        this.setState({ interval: clearInterval(this.state.interval) });
  }
  restart() {
    this.stop(this.start);
  }
  persistSamples() {
    io.saveToFile(this.state.samples);
  }
  run() {
    battery()
      .then((stats) => {
        const samples = this.state.samples.slice();
        samples.push(Object.assign(stats, { timeStamp: new Date() }));
        this.setState({ samples, stats }, this.persistSamples);
      });
  }
  updateInterval(evt) {
    const intervalToDisplay = evt.target.value;
    const intervalMs = intervalToDisplay !== '' ? parseInt(evt.target.value) * 1000 * 60 : 0;
    const callback = intervalMs ? debounce(this.restart, 100) : debounce(this.stop, 100);
    this.setState({ intervalMs, intervalToDisplay }, callback);
  }
  render() {
    const { stats, samples, interval, history } = this.state;
    if (stats) {
      const time = stats.timetoempty || stats.timetofull;
      return (
        <ErrorBoundary>
          <div className="app-wrapper">
            <AppBar position="static">
              <Toolbar>
                <Typography variant="title" color="inherit" style={{ flex: 1 }}>Battery Checker</Typography>
                {interval
                  ? <Button onClick={this.stop} color="inherit">Stop</Button>
                  : <Button onClick={this.start} color="inherit">Start</Button>
                }
              </Toolbar>
            </AppBar>
            <WindowProvider>
              <WindowContext.Consumer>
                {win => (
                  <ScrollArea height={win.height - 64}>
                    <Container>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary">
                            Status
                          </Typography>
                          <Typography variant="headline" component="h1">
                            {stats.percentage ? stats.percentage.formatted : 'unknown'}
                          </Typography>
                          <Typography component="p">
                            State: {stats.state}
                          </Typography>
                          <Typography color="textSecondary">
                            {time ? `${time.formatted} left` : 'unknown'}
                          </Typography>
                          <Typography component="p">
                            Samples: {samples.length}
                          </Typography>
                          <TextField
                            id="interval"
                            label="Interval (m)"
                            type="number"
                            value={this.state.intervalToDisplay}
                            onChange={this.updateInterval}
                            margin="normal"
                          />
                        </CardContent>
                      </Card>
                      <br />
                      <LiveData data={samples} />
                      <br />
                      <Card>
                        {history
                          ? history.map((data, i) => (
                            <ExpansionPanelConditional key={i} title={data.date.toString()}>
                              <TableForRawData>{data}</TableForRawData>
                            </ExpansionPanelConditional>
                          ))
                          : <LinearProgress />
                        }
                      </Card>
                    </Container>
                  </ScrollArea>
                )}
              </WindowContext.Consumer>
            </WindowProvider>
          </div >
        </ErrorBoundary>
      );
    }
    return <p>Initializing...</p>;
  }
}

export default App;
