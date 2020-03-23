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
} from 'reactstrap';

import { getUserIdFromToken, getUserTypeFromToken } from './home';
import axiosInstance from '../../axiosApi';

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayNewEventForm: false,
      displayEditEventForm: false,
    };

    this.handleDateClick = this.handleDateClick.bind(this);
    this.handleEventClick = this.handleEventClick.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
  }

  handleDateClick(info) {
    // alert(info.dateStr);
    this.toggleForm('new');
  }

  handleEventClick(info) {
    // alert(info.event.title);
    // alert(info.event.id);
    this.toggleForm('edit');
  }

  handleSelect(info) {
    
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
              <NewEventForm state={this.state} toggle={this.toggleForm}/>
              <EditEventForm state={this.state} toggle={this.toggleForm}/>
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
  const student_list = [];
  // try {
  //   const response = await axiosInstance.get('/yoyaku/users/student_list/');
  //   for (let student of response.data) {
  //     student_list.push(`${student.last_name}, ${student.first_name} ${student.id}`);
  //   }
  //   student_list.sort();
  // } catch (err) {
  //   alert(err);
  // }
  return(
    <Modal isOpen={props.state.displayNewEventForm} toggle={() => {props.toggle('new');}}>
      <ModalHeader toggle={() => props.toggle('new')}>Create New Event</ModalHeader>
      <ModalBody>
        Create New Event

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