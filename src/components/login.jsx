import React, { Component } from 'react';
import axiosInstance from '../axiosApi';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState( {[event.target.name]: event.target.value} );
  }

  async handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/token/obtain/', {
        email: this.state.email,
        password: this.state.password,
      });
      axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + response.data.access;
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      return response;
    } catch (error) {
      alert(error);
    }
  }

  render() {
    return (
      <div>
        Login
            <form onSubmit={this.handleSubmit}>
          <label>
            Email:
            <input name='email' type='text' value={this.state.email} onChange={this.handleChange}/>
          </label>
          <label>
            Password:
            <input name='password' type='password' value={this.state.password} onChange={this.handleChange}/>
          </label>
          <input type='submit' value='Submit'/>
        </form>
      </div>
    );
  }
}

export default Login;