import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from '@fullcalendar/bootstrap';
import {
  Container,
  Modal, 
  ModalHeader, 
  ModalBody, 
  Button, 
  Form, 
  FormGroup, 
  Label, 
  Input, 
} from 'reactstrap';

import { getUserIdFromToken, getUserTypeFromToken } from './home';
import axiosInstance from '../../axiosApi';

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      start: '',
      end: '',
      student_user: [],
      teacher_user: '',
      selectedDate: '',
      studentList: [],
      displayNewEventForm: false,
      displayEditEventForm: false,
    };

    this.getStudentList = this.getStudentList.bind(this);
    this.handleDateClick = this.handleDateClick.bind(this);
    this.handleEventClick = this.handleEventClick.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this);
    this.handleNewEventSubmit = this.handleNewEventSubmit.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
  }

  componentDidMount() {
    this.getStudentList();
  }

  async getStudentList() {
    const students = [];
    try {
      const response = await axiosInstance.get('/yoyaku/users/student_list/');
      for (let student of response.data) {
        students.push(`${student.last_name}, ${student.first_name} (${student.id})`);
      }
      students.sort();
      this.setState({
        studentList: students,
      });
    } catch (err) {
      alert(err);
    }
  }

  handleDateClick(info) {
    // alert(info.dateStr);
    this.setState({
      selectedDate: info.dateStr,
    });
    this.toggleForm('new');
  }

  handleEventClick(info) {
    // alert(info.event.title);
    // alert(info.event.id);
    // alert(info.event.extendedProps.student_user[0].first_name);
    this.toggleForm('edit');
  }

  handleSelect(info) {
    
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleMultiSelectChange(event) {
    const options = event.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    this.setState({
      [event.target.name]: selectedValues,
    });
  }

  handleNewEventSubmit(event) {
    event.preventDefault();
  }

  toggleForm(formType) {
    if (formType === 'new') {
      this.setState({
        displayNewEventForm: !this.state.displayNewEventForm,
      });
    } else if (formType === 'edit') {
      this.setState({
        displayEditEventForm: !this.state.displayEditEventForm,
      });
    }
  }

  render() {
    return(
      <div className='m-3'>
        <Container>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrapPlugin]} 
            defaultView='dayGridMonth'
            themeSystem='bootstrap'
            slotDuration='00:15:00'
            selectable='true'
            dateClick={this.handleDateClick}
            eventClick={this.handleEventClick}
            select={this.handleSelect}
            header={{
              left: 'prev,next, today',
              center: 'title',
              right: 'timeGridDay,timeGridWeek,dayGridMonth',
            }}
            events={
              (info, successCallback, failureCallback) => {
                axiosInstance.get(`/yoyaku/users/${getUserIdFromToken()}/events/`, {
                  params: {
                    start: info.startStr,
                    end: info.endStr,
                  }
                })
                .then(result => {
                  successCallback(result.data);
                })
                .catch(err => {
                  failureCallback(err);
                });
              }
            }
          />
          {getUserTypeFromToken() === 'TEACHER' ? 
            <div>
              <NewEventForm state={this.state} toggle={this.toggleForm} onChange={this.handleChange} onMultiSelectChange={this.handleMultiSelectChange} onSubmit={this.handleNewEventSubmit}/>
              <EditEventForm state={this.state} toggle={this.toggleForm} onChange={this.handleChange}/>
            </div> 
          :
            null
          }
        </Container>
      </div>
    );
  }
}

function NewEventForm(props) {
  return(
    <Modal isOpen={props.state.displayNewEventForm} toggle={() => {props.toggle('new');}}>
      <ModalHeader toggle={() => props.toggle('new')}>Create New Event on {props.state.selectedDate}</ModalHeader>
      <ModalBody>
        <Container>
          <Form onSubmit={props.handleSubmit}>
            <FormGroup>
              <Label>
                Event Name
                <Input type='text' name='title' value={props.state.title} onChange={props.onChange}/>
              </Label>
            </FormGroup>
            <FormGroup>
              <Label>
                Select Students
                <Input type='select' name='student_user' multiple onChange={props.onMultiSelectChange}> 
                  {props.state.studentList.map((value, index) => 
                    <option key={index} value={value.split(' ')[2].slice(1, -1)}>{value}</option>
                  )}
                </Input>
              </Label>
            </FormGroup>
          </Form>
        </Container>
      </ModalBody>
    </Modal>
  );
}

function EditEventForm(props) {
  return(
    <Modal isOpen={props.state.displayEditEventForm} toggle={() => {props.toggle('edit');}}>
      <ModalHeader toggle={() => props.toggle('edit')}>Edit Event</ModalHeader>
      <ModalBody>
        Edit Event
      </ModalBody>
    </Modal>
  );
}

export default Calendar;