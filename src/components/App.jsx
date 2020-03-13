import React, { useState } from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
} from 'reactstrap';

import Login from './login';
import Signup from './signup';
import Profile from './profile';
import axiosInstance from '../axiosApi';

export const history = createBrowserHistory({forceRefresh: true});

export default class App extends React.Component {
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

function Landing(props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return(
    <div>
      <Navbar color='dark' light expand='md'>
        <NavbarBrand className='text-muted' href='/'>Yoyaku</NavbarBrand>
        <NavbarToggler onClick={toggle}/>
        <Collapse isOpen={isOpen} navbar>
          <Nav className='ml-auto' navbar>
            <NavItem>
              <NavLink className='text-muted' tag={Link} to='/login/'>Login</NavLink>
            </NavItem>
            <NavItem>
              <NavLink className='text-muted' tag={Link} to='/signup/'>Signup</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>  

      <Switch>
        <Route exact path={'/login/'}>
          <Login handleLogin={props.handleLogin}/>
        </Route> 
        <Route exact path={'/signup/'}>
          <Signup/>
        </Route>
      </Switch>
    </div>
  );
}

function Home(props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return(
    <div>
      <Navbar color='dark' light expand='md'>
        <NavbarBrand className='text-muted' href='/'>Yoyaku</NavbarBrand>
        <NavbarToggler onClick={toggle}/>
        <Collapse isOpen={isOpen} navbar>
          <Nav className='mr-auto' navbar>
            <NavItem>
              <NavLink className='text-muted' tag={Link} to='/profile/'>Profile</NavLink>
            </NavItem>
            <NavItem>
              <NavLink className='text-muted' tag={Link} to='/calendar/'>Calendar</NavLink>
            </NavItem>
          </Nav>
          <Nav className='ml-auto' navbar>
            <NavItem>
              <Button outline color='danger' onClick={props.handleLogout}>Logout</Button>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>  

      <Switch>
        <Route exact path={'/profile/'}>
          {props.state.isAuthenticated ?
            <Profile/> : <Redirect to='/login/'/>
          }
        </Route>)
        <Route exact path={'/calendar/'}>
          {props.state.isAuthenticated ?
            <FullCalendar defaultView='dayGridMonth' plugins={[dayGridPlugin]} />: <Redirect to='/login/'/>
          }
        </Route>)
      </Switch>
    </div>
  );
}
