import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';

import Profile from './profile';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
     <h2>Home</h2>
    );
  }
}

export default Home;