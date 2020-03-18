import React, { Component } from 'react';
import axiosInstance from '../../axiosApi';
import {
  Container,
  Button, 
  Form, 
  FormGroup, 
  Label, 
  Input, 
} from 'reactstrap';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLogin = props.handleLogin;
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
      this.handleLogin();
      return response;
    } catch (error) {
      alert(error);
    }
  }

  render() {
    return (
      <Container>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label>
              Email
              <Input type='email' name='email' placeholder='email@address.com' value={this.state.email} onChange={this.handleChange}/>
            </Label>
          </FormGroup>
          <FormGroup>
            <Label>
              Password
              <Input type='password' name='password' placeholder='password' value={this.state.password} onChange={this.handleChange}/>
            </Label>
          </FormGroup>
          <Button outline color='info'>Submit</Button>
        </Form>
      </Container>
    );
  }
}

export default Login;