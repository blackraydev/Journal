import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import Auth from './components/Auth';
import Groups from './components/Groups';
import Homeworks from './components/Homeworks';
import Marks from './components/Marks';
import Navbar from './components/Navbar';
import Reports from './components/Reports';
import Schedule from './components/Schedule';
import Diary from './components/Student/Diary';
import Subjects from './components/Subjects';
import TeacherSchedule from './components/Teacher/TeacherSchedule';
import Users from './components/Users';

import './custom.css'

export default class App extends Component {
  render () {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={Auth} />
          <Route path="/teacher">
            <Navbar />
            <Switch>
              <Route exact path="/teacher" component={TeacherSchedule}/>
            </Switch>
          </Route>
          <Route path="/student">
            <Navbar />
            <Switch>
              <Route exact path="/student" component={Diary}/>
            </Switch>
          </Route>
          <Route path="/main">
            <Navbar />
            <Switch>
              <Route exact path="/main" component={Subjects}/>
              <Route exact path="/main/groups" component={Groups}/>
              <Route exact path="/main/users" component={Users}/>
              <Route exact path="/main/reports" component={Reports}/>
              <Route path="/main/schedule">
                <Switch>
                  <Route exact path="/main/schedule" component={Schedule}/>
                  <Route exact path="/main/schedule/:id" component={Marks}/>
                  <Route exact path="/main/schedule/:id/homework" component={Homeworks}/>
                </Switch>
              </Route>
            </Switch>
          </Route>
        </Switch>
      </div>
    );
  }
}
