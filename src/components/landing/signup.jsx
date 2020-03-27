import React, { Component } from 'react';
import moment from 'moment-timezone';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import {
  Container,
  Button,  
  FormGroup, 
  Label, 
  Input, 
  Col,
  Row,
} from 'reactstrap';

import axiosInstance from '../../axiosApi';


class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      user_type: 'STUDENT',
      time_zone: 'Africa/Abidjan',
      student_profile: {
        school_name: '',
        school_grade: '-1',
      },
      teacher_profile: {
        association: '',
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeStudentProfile = this.handleChangeStudentProfile.bind(this);
    this.handleChangeTeacherProfile = this.handleChangeTeacherProfile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleChangeStudentProfile(event) {
    this.setState({
        student_profile: {
          ...this.state.student_profile,
          [event.target.name]: event.target.value,
        }
    });
  }

  handleChangeTeacherProfile(event) {
    this.setState({
        teacher_profile: {
          ...this.state.teacher_profile,
          [event.target.name]: event.target.value,
        }
    });
  }

  // TODO error handling and validation
  // TODO field validation
  async handleSubmit(event) {
    event.preventDefault();
    switch(this.state.user_type) {
      case 'STUDENT':
        await Promise.resolve(this.setState({teacher_profile: null}));
        break;
      case 'TEACHER':
        await Promise.resolve(this.setState({student_profile: null}));
        break;
      default:
    }

    try {
      const response = await axiosInstance.post('/yoyaku/users/', this.state);
      // history.push('/login/');
      return response;
    } catch(error) {
      console.log(error.stack);
    }
  }

  render() {
    return (
      <Container>
        <AvForm onValidSubmit={this.handleSubmit}>
          <GeneralSignup 
            profile={this.state}
            handleChange={this.handleChange}
          />
          {this.state.user_type === 'STUDENT' && 
            <StudentProfileSignup
              student_profile={this.state.student_profile} 
              onChange={this.handleChangeStudentProfile}
            />
          }
          {this.state.user_type === 'TEACHER' && 
            <TeacherProfileSignup
              teacher_profile={this.state.teacher_profile} 
              onChange={this.handleChangeTeacherProfile}
            />
          }
          <Button outline color='info'>Submit</Button>
        </AvForm>
      </Container>
    )
  }
}


function GeneralSignup(props) {
  return(
    <div>
      <AvField type='email' label='Email' name='email' value={props.profile.email} onChange={props.handleChange} validate={{
        required: {value: true, errorMessage: 'Please enter an email'},
        email: {value: true, errorMessage: 'Please enter a valid email address (e.g. example@website.com)'},
      }}/>
      <AvField type='password' label='Password' name='password' value={props.profile.password} onChange={props.handleChange} validate={{
        required: {value: true, errorMessage: 'Please enter a password'},
        minLength: {value: 8, errorMessage: 'Password must have at least 8 characters'},
      }}/>
      <AvField type='password' label='Confirm Password' name='confirm_password' validate={{
        required: {value: true, errorMessage: 'Please retype password'},
        match:{value:'password', errorMessage: 'Passwords do not match'},
      }}/>
      <Row form>
        <Col md='6'>
          <AvField type='text' label='First Name' name='first_name' value={props.profile.first_name} onChange={props.handleChange} validate={{
            required: {value: true, errorMessage: 'Please enter first name'},
          }}/>
        </Col>
        <Col md='6'>
          <AvField type='text' label='Last Name' name='last_name' value={props.profile.last_name} onChange={props.handleChange} validate={{
            required: {value: true, errorMessage: 'Please enter last name'},
          }}/>
        </Col>
      </Row>
      <FormGroup tag='fieldset'>
        <legend>User Type</legend>
        <FormGroup check>
          <Label check>
            <Input type='radio' name='user_type' value='TEACHER' onChange={props.handleChange}/>
            Teacher
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input type='radio' name='user_type' value='STUDENT' defaultChecked onChange={props.handleChange}/>
            Student
          </Label>
        </FormGroup>
      </FormGroup>
      <FormGroup>
        <Label>
          Select Time Zone
          <Input type='select' name='time_zone' value={props.profile.time_zone} onChange={props.handleChange}> 
            {moment.tz.names().map((value, index) =>  // TODO there are timezones that aren't support by pytz
              <option key={index} value={value}>{value}</option>
            )}
          </Input>
        </Label>
      </FormGroup>
    </div>
  );
}


function StudentProfileSignup(props) {
  const schoolGrades = ['Preschool', 'Kindergarten', 'First Grade', 'Second Grade', 'Third Grade', 'Fourth Grade', 
  'Fifth Grade', 'Sixth Grade', 'Seventh Grade', 'Eighth Grade', 'Ninth Grade', 'Tenth Grade', 'Eleventh Grade', 'Twelvth Grade',]
  return(
    <div>
      <AvField type='text' label='School Name' name='school_name' value={props.student_profile.school_name} onChange={props.onChange} validate={{
        required: {value: true, errorMessage: 'Please enter a school name'}
      }}/>
      <FormGroup>
        <Label>
          School Grade
          <Input type='select' name='school_grade' value={props.student_profile.school_grade} onChange={props.onChange}>
            {schoolGrades.map((value, index) => 
              <option key={index} value={index-1}>{value}</option>
            )}
          </Input>
        </Label>
      </FormGroup>
    </div>
  );
}


function TeacherProfileSignup(props) {
  return(
    <div>
      <AvField type='text' label='Association' name='association' value={props.teacher_profile.association} onChange={props.onChange} validate={{
        required: {value: true, errorMessage: 'Please enter an association'}
      }}/>
    </div>
  );
}


export default Signup;