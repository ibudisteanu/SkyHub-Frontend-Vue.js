/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/10/2017.
 * (C) BIT TECHNOLOGIES
 */


import React from 'react';
import Link from '../../../../../Link/Link';

import AuthService from './../../../../../../services/REST/authentication/Auth.service';
import Notification from "../../../../../../modules/notifications/models/Notification.model";
import NotificationMenu from "../../../../../../modules/notifications/NotificationsMenu.component";

class AuthenticatedHeaderNavigationMenu extends React.Component {

  AuthService = null;



  componentDidMount() {
    requestAnimationFrame(() => { //Make sure it is on client only


    });
  }

  handleLogout(e){
    e.preventDefault(); e.stopPropagation();


    AuthService.logout();
  }

  render() {

    // let notification1 = new Notification({
    //   body: '3323',
    //   destinationId: '2145',
    //   senderId: '4151251',
    //   description: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum ',
    //   id: '425151',
    //   dtCreation: '23/jan/1987',
    //   template: '',
    //   title: 'so such a lovly twist'
    // });

    //console.log("######## AUTHENTICATED HEADER", this);
    return (


      <ul className="nav navbar-top-links navbar-right">


        <li>
          <Link to="/">
            <i className="fa fa-home"></i>
            <span className="m-r-sm text-muted welcome-message">Home</span>
          </Link>
        </li>

        <li>
          <Link to="/">
            <i className="fa fa-home"></i>
            <span className="m-r-sm text-muted welcome-message">Profile</span>
          </Link>
        </li>


        <NotificationMenu/>


        <li className="dropdown">
          <a className="dropdown-toggle count-info" data-toggle="dropdown" href="#">
            <i className="fa fa-bell"></i>  <span className="label label-primary">8</span>
          </a>
          <ul className="dropdown-menu dropdown-alerts">
            <li>
              <a href="mailbox.html">
                <div>
                  <i className="fa fa-envelope fa-fw"></i> You have 16 messages
                  <span className="pull-right text-muted small">4 minutes ago</span>
                </div>
              </a>
            </li>
            <li className="divider"></li>
            <li>
              <a href="profile.html">
                <div>
                  <i className="fa fa-twitter fa-fw"></i> 3 New Followers
                  <span className="pull-right text-muted small">12 minutes ago</span>
                </div>
              </a>
            </li>
            <li className="divider"></li>
            <li>
              <a href="grid_options.html">
                <div>
                  <i className="fa fa-upload fa-fw"></i> Server Rebooted
                  <span className="pull-right text-muted small">4 minutes ago</span>
                </div>
              </a>
            </li>
            <li className="divider"></li>
            <li>
              <div className="text-center link-block">
                <a href="notifications.html">
                  <strong>See All Alerts</strong>
                  <i className="fa fa-angle-right"></i>
                </a>
              </div>
            </li>
          </ul>
        </li>


        <li>
          <Link to="/logout" onClick={::this.handleLogout}>
            <i className="fa fa-sign-out"></i> Log out
          </Link>
        </li>

        <li>
          <a className="right-sidebar-toggle">
            <i className="fa fa-tasks"></i>
          </a>
        </li>

      </ul>
    );
  }
}

export default AuthenticatedHeaderNavigationMenu;
