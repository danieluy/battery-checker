import React from 'react';
import PropTypes from 'prop-types';
import { RoundExpandMore } from '../svg-icons';
// Material UI
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

class ExpansionPanelConditional extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      expanded: false
    };
  }
  render() {
    const { title, children } = this.props;
    return (
      <ExpansionPanel onChange={(evt, expanded) => this.setState({ expanded })}>
        <ExpansionPanelSummary expandIcon={<RoundExpandMore />}>
          <Typography>{title}</Typography>
        </ExpansionPanelSummary>
        {this.state.expanded &&
          <ExpansionPanelDetails>
            {children}
          </ExpansionPanelDetails>
        }
      </ExpansionPanel>
    );
  }
}

export default ExpansionPanelConditional;

ExpansionPanelConditional.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element
  ]).isRequired
};
