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
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
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
            <NavbarBrand className='text-warning' href='/'>
              <span className='m-2'><FontAwesomeIcon icon='school' size='md'/></span>
              Success Academy
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle}/>
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className='mr-auto' navbar>
                <NavItem>
                  <NavLink className='text-warning' tag={Link} to='/profile/'>Profile</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className='text-warning' tag={Link} to='/calendar/'>Calendar</NavLink>
                </NavItem>
              </Nav>
              <Nav className='ml-auto' navbar>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle className='text-warning' nav caret>
                    <span className='m-1'><FontAwesomeIcon icon='user' size='lg' color='green'/></span>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>
                      <NavLink className='text-muted' tag={Link} to='/profile/'>Profile</NavLink>
                    </DropdownItem>
                    <DropdownItem>
                      Edit Profile
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>
                      <Button outline color='danger' onClick={this.handleLogout}>Logout</Button>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
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