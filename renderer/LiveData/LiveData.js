import React from 'react';
import PropTypes from 'prop-types';
import { Line as LineChart } from 'react-chartjs-2';
import { RoundExpandMore } from '../common/svg-icons';
import TableForRawData from '../TableForRawData/TableForRawData';
// Material UI
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import LinearProgress from '@material-ui/core/LinearProgress';

class LiveData extends React.Component {
  constructor() {
    super();
    this.state = {

    };
    this.options = {
      scaleShowVerticalLines: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            max: 100
          }
        }]
      }
    };
  }
  render() {
    const { data } = this.props;
    const dataToDisplay = [];
    const labels = [];
    let statusColor = '#888888';
    let label = '';
    const liveData = data ? { data: data.reverse(), date: new Date() } : null;
    data.sort((a, b) => (a.timeStamp > b.timeStamp ? 1 : -1));
    data.forEach((record, i) => {
      dataToDisplay.push(record.percentage.value);
      labels.push(i);
      statusColor = record.state === 'charging' ? '#50e45c' : '#e45050';
      label = record.state.toUpperCase();
    });
    return (
      <Card className="live-data">
        <LineChart
          data={{
            labels,
            datasets: [{
              label,
              data: dataToDisplay,
              backgroundColor: statusColor,
              borderWidth: 0,
              pointRadius: 0,
              pointHoverRadius: 0
            }]
          }}
          options={this.options}
        />
        {liveData
          ? (
            <ExpansionPanel defaultExpanded={true}>
              <ExpansionPanelSummary expandIcon={<RoundExpandMore />}>
                <Typography>Raw data</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <TableForRawData>{liveData}</TableForRawData>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )
          : <LinearProgress />
        }
      </Card>
    );
  }
}

export default LiveData;

LiveData.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired
};

