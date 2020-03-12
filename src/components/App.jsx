import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import Login from './login';
import Signup from './signup';
import Profile from './profile';
import Home from './home';
import '../main.scss'; // webpack must be configured to do this
import axiosInstance from '../axiosApi';

export const history = createBrowserHistory({forceRefresh: true});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
    };
  }

  async handleLogout() {
    try {
      const response = await axiosInstance.post('/yoyaku/blacklist/', {
        'refresh_token': localStorage.getItem('refresh_token')
      });
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      axiosInstance.defaults.headers['Authorization'] = null;
      return response;
    }
    catch(e) {
      console.log(e);
    }
  }

  render() {
    return (
      // <FullCalendar defaultView='dayGridMonth' plugins={[dayGridPlugin]} />
      <div className='site'>
        <nav>
          <Link className={'nav-link'} to={'/'}>Home</Link>
          <Link className={'nav-link'} to={'/login/'}>Login</Link>
          <Link className={'nav-link'} to={'/signup/'}>Signup</Link>
          <Link className={'nav-link'} to={'/profile/'}>Profile</Link>
          <button onClick={() => this.handleLogout()}>Logout</button>
        </nav>
        <main>
          <h1>Yoyaku Site</h1>
          <Switch>
            <Route exact path={'/login/'} component={Login}/>
            <Route exact path={'/signup/'} component={Signup}/>
            <Route exact path={'/profile/'} component={Profile}/>
            <Route exact path={'/'} component={Home}/>
          </Switch>
        </main>
      </div>
    )
  }

}