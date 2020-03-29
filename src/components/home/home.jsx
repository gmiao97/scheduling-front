import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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

import Profile from './profile';
import Calendar from './calendar';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };

    this.handleLogout = props.handleLogout;
    this.toggle = this.toggle.bind(this);
  }

  componentDidCatch(error, info) {
    console.log(info.componentStack);
    console.log(error);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    return(
      <div>
        <div>
          <Navbar color='dark' dark expand='sm'>
            <NavbarBrand className='text-info' href='/'>
              <span className='m-1'><FontAwesomeIcon icon='language' size='lg'/></span>
              Yoyaku
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle}/>
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className='mr-auto' navbar>
                <NavItem>
                  <NavLink className='text-info' tag={Link} to='/profile/'>Profile</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className='text-info' tag={Link} to='/calendar/'>Calendar</NavLink>
                </NavItem>
              </Nav>
              <Nav className='ml-auto' navbar>
                <NavItem>
                  <Button outline color='danger' onClick={this.handleLogout}>Logout</Button>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>  
          <Switch>
            <Route exact path={'/profile/'}>
              <Profile/>
            </Route>
            <Route exact path={'/calendar/'}>
              <Calendar/>
            </Route>
            <Route exact path={'/'}>
              <Profile/>
            </Route>
          </Switch>
        </div>
      </div>
    );
  }
}

export default Home;