/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/9/2017.
 * (C) BIT TECHNOLOGIES
 */


import React from 'react';
import PropTypes from 'prop-types';

class ChatStickyButton extends React.Component {
  static propTypes = {

  };

  handleOpenChatClick(){
    // Open close small chat
    $('.open-small-chat').on('click', function () {
      $(this).children().toggleClass('fa-comments').toggleClass('fa-remove');
      $('.small-chat-box').toggleClass('active');
    });

    // Initialize slimscroll for small chat
    $('.small-chat-box .content').slimScroll({
      height: '234px',
      railOpacity: 0.4
    });

  }

  render() {
    return (
      <div className="sticky-button-position" style={this.props.style} onClick={::this.handleOpenChatClick}>

        <span className="badge badge-warning pull-right">0</span>

        <a className="sticky-button sticky-button-chat">

          <i className="fa fa-comments sticky-button-icon"></i>

        </a>

      </div>
  )
};
}

export default ChatStickyButton;
