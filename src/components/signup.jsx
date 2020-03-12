import React, { Component } from 'react';
import moment from 'moment-timezone';
import axiosInstance from '../axiosApi';


class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      user_type: '',
      time_zone: '',
      student_profile: {
        school_name: '',
        school_grade: '-1',
      },
      teacher_profile: {
        association: '',
      },
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeStudentProfile = this.handleChangeStudentProfile.bind(this);
    this.handleChangeTeacherProfile = this.handleChangeTeacherProfile.bind(this);
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
      return response;
    } catch(error) {
      console.log(error.stack);
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
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
          <input type='submit' value='Submit'/>
        </form>
      </div>
    )
  }
}


function GeneralSignup(props) {
  return(
    <div>
      <h2>Signup</h2>
      <label>
        Email
        <input name='email' type='text' value={props.profile.email} onChange={props.handleChange}/>
      </label>
      <label>
        Password
        <input name='password' type='password' value={props.profile.password} onChange={props.handleChange}/>
      </label>
      <label>
        First Name
        <input name='first_name' type='text' value={props.profile.first_name} onChange={props.handleChange}/>
      </label>
      <label>
        Last Name
        <input name='last_name' type='text' value={props.profile.last_name} onChange={props.handleChange}/>
      </label>
      <div>
        <p>User Type</p>
        <label>
          Teacher
          <input name='user_type' type='radio' value='TEACHER' onChange={props.handleChange}/>
        </label>
        <label>
          Student
          <input name='user_type' type='radio' value='STUDENT' onChange={props.handleChange}/>
        </label>
      </div>
      <label>
        Time Zone
        <select name='time_zone' value={props.profile.time_zone} onChange={props.handleChange}>
          {moment.tz.names().map((value, index) =>  // TODO there are timezones that aren't support by packed pytz
            <option key={index} value={value}>{value}</option>
          )}
        </select>
      </label>
    </div>
  );
}


function StudentProfileSignup(props) {
  const schoolGrades = ['Preschool', 'Kindergarten', 'First Grade', 'Second Grade', 'Third Grade', 'Fourth Grade', 
  'Fifth Grade', 'Sixth Grade', 'Seventh Grade', 'Eighth Grade', 'Ninth Grade', 'Tenth Grade', 'Eleventh Grade', 'Twelvth Grade',]
  return(
    <div>
      Student Profile
      <label>
        School Name
        <input name='school_name' type='text' value={props.student_profile.school_name} onChange={props.onChange}/>
      </label>
      <label>
        School Grade
        <select name='school_grade' value={props.student_profile.school_grade} onChange={props.onChange}>
          {schoolGrades.map((value, index) => 
            <option key={index} value={index-1}>{value}</option>
          )}
        </select>
      </label>
    </div>
  );
}


function TeacherProfileSignup(props) {
  return(
    <div>
      Teacher Profile
      <label>
        Association
        <input name='association' type='text' value={props.teacher_profile.association} onChange={props.onChange}/>
      </label>
    </div>
  );
}


export default Signup;