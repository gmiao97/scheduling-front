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

class Calendar extends Component {
  constructor(props) {
    super(props);

    this.handleDateClick = this.handleDateClick.bind(this);
    this.handleEventClick = this.handleEventClick.bind(this);
  }

  handleDateClick(info) {
    alert(info.dateStr);
  }

  handleEventClick(info) {
    alert(info.event.title);
  }

  render() {
    return(
      <Container>
        <FullCalendar 
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrapPlugin]} 
          defaultView='dayGridMonth'
          themeSystem='bootstrap'
          slotDuration='00:30:00'
          selectable='true'
          dateClick={this.handleDateClick}
          eventClick={this.handleEventClick}
          header={{
            left: 'prev,next, today',
            center: 'title',
            right: 'timeGridWeek,dayGridMonth',
          }}
          events={{
            url: `http://127.0.0.1:8000/yoyaku/users/${getUserIdFromToken()}/events/`,
            method: 'GET',
          }}
        /> 
      </Container>
    );
  }
}

export default Calendar;