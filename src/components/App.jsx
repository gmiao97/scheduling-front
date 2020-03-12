import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import Login from './login';
import Signup from './signup';
import MyProfile from './profile';
import '../main.scss'; // webpack must be configured to do this


export default class App extends React.Component {

  render() {
    return (
      // <FullCalendar defaultView='dayGridMonth' plugins={[dayGridPlugin]} />
      <div className='site'>
        <nav>
          <Link className={'nav-link'} to={'/'}>Home</Link>
          <Link className={'nav-link'} to={'/login/'}>Login</Link>
          <Link className={'nav-link'} to={'/signup/'}>Signup</Link>
          <Link className={'nav-link'} to={'/profile/'}>Profile</Link>
        </nav>
        <main>
          <h1>Yoyaku Site</h1>
          <Switch>
            <Route exact path={'/login/'} component={Login}/>
            <Route exact path={'/signup/'} component={Signup}/>
            <Route exact path={'/profile/'} component={MyProfile}/>
            <Route exact path={'/'} render={() => <div>Home</div>}/>
          </Switch>
        </main>
      </div>
    )
  }

}