import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { DateTimePicker, Multiselect } from 'react-widgets';
import moment from 'moment-timezone';
import { AvForm, AvField } from 'availity-reactstrap-validation';
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
    this.handleWidgetChange = this.handleWidgetChange.bind(this);
    this.handleNewEventSubmit = this.handleNewEventSubmit.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
  }

  componentDidMount() {
    this.getStudentList();
    this.setState({
      teacher_user: getUserIdFromToken(),
    });
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
    this.setState({
      selectedDate: moment.tz(info.dateStr, moment.tz.guess()).format(),
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

  handleWidgetChange(name, value) {
    this.setState({
      [name]: value,
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
              <NewEventForm 
                state={this.state} 
                toggle={this.toggleForm} 
                onChange={this.handleChange} 
                onMultiSelectChange={this.handleMultiSelectChange} 
                onWidgetChange={this.handleWidgetChange}
                onSubmit={this.handleNewEventSubmit}/>
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
          <AvForm onValidSubmit={props.handleSubmit}>
            <AvField type='text' label='Event Name' name='title' value={props.state.title} onChange={props.onChange} validate={{
              required: {value: true, errorMessage: 'Please enter event name'},
            }}/>
            Select Students
            <Multiselect
              name='student_user'
              data={props.state.studentList}
              onChange={value => props.onWidgetChange('student_user', value.map(student => student.split(' ')[2].slice(1, -1)))}
            />
            <FormGroup> {/* TODO validations that start < end */}
              Start
              <DateTimePicker
                name='start'
                onChange={value => props.onWidgetChange('start', value.toISOString())}
                date={false}
                currentDate={new Date(props.state.selectedDate)}
                step={15}
              />
              End
              <DateTimePicker 
                onChange={value => props.onWidgetChange('end', value.toISOString())}
                date={false}
                currentDate={new Date(props.state.selectedDate)}
                step={15}
              />
            </FormGroup>
            <Button outline color='info'>Submit</Button>
          </AvForm>
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