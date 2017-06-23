/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/21/2017.
 * (C) BIT TECHNOLOGIES
 */

import React from 'react';
import PropTypes from 'prop-types';

import NotificationService from './../../services/Notifications/Notification.service';

class NotificationStickyButton extends React.Component {
  static propTypes = {

  };

  handleStickyButtonClick(){
    return NotificationService.askForPermissions();
  }

  render() {

    if (NotificationService.permissionAlreadyGranted())
      return (<div />);

    return (
      <div className="sticky-button-position" style={this.props.style} onClick={::this.handleStickyButtonClick}>

        <span className="badge badge-primary pull-right">0</span>

        <a className="sticky-button sticky-button-notification">

          <i className="fa fa-bell sticky-button-icon "></i>

        </a>

      </div>
    )
  };
}

export default NotificationStickyButton;
