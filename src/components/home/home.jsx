import React, { useState } from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
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


export function getUserIdFromToken() {
  const token = localStorage.getItem('access_token');
  const encodedPayLoad = token.split('.')[1];
  const payloadObject = JSON.parse(atob(encodedPayLoad));
  const userId = payloadObject.user_id;
  return userId;
}

function Home(props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return(
    <div>
      <div>
        <Navbar color='dark' dark expand='sm'>
          <NavbarBrand className='text-info' href='/'>
            <span className='m-1'><FontAwesomeIcon icon='language' size='lg'/></span>
            Yoyaku
          </NavbarBrand>
          <NavbarToggler onClick={toggle}/>
          <Collapse isOpen={isOpen} navbar>
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
                <Button outline color='danger' onClick={props.handleLogout}>Logout</Button>
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

export default Home;