import React, { Component } from 'react';
import {
  Spinner,
} from 'reactstrap';

import axiosInstance from '../../axiosApi'

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      first_name: '',
      last_name: '',
      user_type: '',
      time_zone: '',
      student_profile: {},
      teacher_profile: {},
    };
    this.getProfile = this.getProfile.bind(this);
  }

  async getProfile() {
    try {
      const userId = getUserIdFromToken();
      let response = await axiosInstance.get(`/yoyaku/users/${userId}/`)
      const message = response.data;
      this.setState(
        message
      );
      return message;
    } catch(error) {
      console.log('Error: ', JSON.stringify(error, null, 4));
      throw error;
    }
  }

  componentDidMount() {
    this.getProfile();
  }

  render() {
    return(
      <div>
        <p>{this.state.student_profile.school_name}</p>
        <Spinner type="grow" color="success" />
      </div>
    );
  }
}

function getUserIdFromToken() {
  const token = localStorage.getItem('access_token');
  const encodedPayLoad = token.split('.')[1];
  const payloadObject = JSON.parse(atob(encodedPayLoad));
  const userId = payloadObject.user_id;
  return userId;
}

export default Profile;