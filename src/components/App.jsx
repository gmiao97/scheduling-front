import React, { Component } from 'react';
import { createBrowserHistory } from 'history';

import Landing from './landing/landing';
import Home from './home/home';
import axiosInstance from '../axiosApi';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    this.isAuthenticated();
  }

  async isAuthenticated() {
    const access_token = localStorage.getItem('access_token');
    try {
      const response = await axiosInstance.get('/yoyaku/validate-token/', { access: access_token });
      this.setState({
        isAuthenticated: true,
      });
    } 
    catch (error) {
      this.setState({
        isAuthenticated: false,
      });
    }
  }

  handleLogin() {
    this.setState({
      isAuthenticated: true,
    });
  }

  async handleLogout() {
    try {
      const response = await axiosInstance.post('/yoyaku/blacklist/', {
        'refresh_token': localStorage.getItem('refresh_token')
      });
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      axiosInstance.defaults.headers['Authorization'] = null;
      this.setState({
        isAuthenticated: false,
      });
      return response;
    }
    catch(e) {
      console.log(e);
    }
  }

  render() {
    return (
      // <FullCalendar defaultView='dayGridMonth' plugins={[dayGridPlugin]} />
      <div>
        {this.state.isAuthenticated ? 
          <Home state={this.state} handleLogout={this.handleLogout}/> : 
          <Landing handleLogin={this.handleLogin}/>
        }
      </div>
      
    );
  }
}

export default App;
export const history = createBrowserHistory({forceRefresh: true});
