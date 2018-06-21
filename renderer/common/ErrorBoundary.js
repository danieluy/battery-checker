import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      info: null
    };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
  }

  render() {
    if (this.state.error || this.state.info)
      return (
        <React.Partial>
          <h1>Something went wrong.</h1>
          <pre>{JSON.stringify(this.state, null, 2)}</pre>
        </React.Partial>
      );
    return this.props.children;
  }
}

export default ErrorBoundary;
