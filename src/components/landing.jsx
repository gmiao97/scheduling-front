import React, { useState } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
} from 'reactstrap';

import Login from './login';
import Signup from './signup';


function Landing(props) {
  const [isOpen, setIsOpen] = useState(false);
  const navToggle = () => setIsOpen(!isOpen);
  const [modal1, setModal1] = useState(false);
  const modalToggle1 = () => setModal1(!modal1);
  const [modal2, setModal2] = useState(false);
  const modalToggle2 = () => setModal2(!modal2);

  return (
    <div>
      <Navbar color='dark' light expand='md'>
        <NavbarBrand className='text-muted' href='/'>Yoyaku</NavbarBrand>
        <NavbarToggler onClick={navToggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className='ml-auto' navbar>
            <NavItem>
              <div>
                <Button className='m-1' outline color='primary' onClick={modalToggle1}>Signup</Button>
                <Modal isOpen={modal1} toggle={modalToggle1}>
                  <ModalHeader toggle={modalToggle1}>Signup</ModalHeader>
                  <ModalBody>
                    <Signup/>
                  </ModalBody>
                </Modal>
              </div>
            </NavItem>
            <NavItem>
              <div>
                <Button className='m-1' outline color='primary' onClick={modalToggle2}>Login</Button>
                <Modal isOpen={modal2} toggle={modalToggle2}>
                  <ModalHeader toggle={modalToggle2}>Login</ModalHeader>
                  <ModalBody>
                    <Login handleLogin={props.handleLogin}/>
                  </ModalBody>
                </Modal>
              </div>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Landing;