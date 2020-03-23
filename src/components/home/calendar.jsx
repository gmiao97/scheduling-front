import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from '@fullcalendar/bootstrap';
import {
  Container,
} from 'reactstrap';

import { getUserIdFromToken } from './home';
import axiosInstance from '../../axiosApi';

class Calendar extends Component {
  constructor(props) {
    super(props);

    this.handleDateClick = this.handleDateClick.bind(this);
    this.handleEventClick = this.handleEventClick.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleDateClick(info) {
    alert(info.dateStr);
  }

  handleEventClick(info) {
    alert(info.event.title);
    alert(info.event.id);
  }

  handleSelect(info) {
    
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
        </Container>
      </div>
    );
  }
}

export default Calendar;