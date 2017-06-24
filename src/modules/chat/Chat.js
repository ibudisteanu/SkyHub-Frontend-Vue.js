/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/9/2017.
 * (C) BIT TECHNOLOGIES
 */



import React from 'react';
import PropTypes from 'prop-types';

class Chat extends React.Component {
  static propTypes = {

  };

  render() {
    return (
      <div className="small-chat-box fadeInRight animated">

        <div className="heading" draggable="true">
          <small className="chat-date pull-right">
            02.19.2015
          </small>
          Small chat
        </div>

        <div className="slimScrollDiv" style={{position: "relative", overflow: "hidden", width: "auto", height: 234}}>

          <div className="content" style={{overflow: "hidden", width: "auto", height: 234}} >

            <div className="left">
              <div className="author-name">
                Monica Jackson
                <small className="chat-date">
                  10:02 am
                </small>
              </div>

              <div className="chat-message active">
                Lorem Ipsum is simply dummy text input.
              </div>

            </div>

            <div className="right">
              <div className="author-name">
                Mick Smith
                <small className="chat-date">
                  11:24 am
                </small>
              </div>
              <div className="chat-message">
                Lorem Ipsum is simpl.
              </div>
            </div>

            <div className="left">
              <div className="author-name">
                Alice Novak
                <small className="chat-date">
                  08:45 pm
                </small>
              </div>
              <div className="chat-message active">
                Check this stock char.
              </div>
            </div>

            <div className="right">
              <div className="author-name">
                Anna Lamson
                <small className="chat-date">
                  11:24 am
                </small>
              </div>
              <div className="chat-message">
                The standard chunk of Lorem Ipsum
              </div>
            </div>

            <div className="left">

              <div className="author-name">
                Mick Lane
                <small className="chat-date">
                  08:45 pm
                </small>
              </div>

              <div className="chat-message active">
                I belive that. Lorem Ipsum is simply dummy text.
              </div>

            </div>
          </div>

          <div className="slimScrollBar" style={{background: 0, width: 7, position: "absolute", top: 0, opacity: 0.4, display: "block", borderRadius: 7, zIndex: 99, right: 1}}>

          </div>

          <div className="slimScrollRail" style={{width: 7, height: "100%", position: "absolute", top: 0, display: "none", borderRadius: 7, background: "#333333", opacity: 0.4, zIndex: 90, right: 1}}>

          </div>
        </div>

        <div className="form-chat">
          <div className="input-group input-group-sm">

            <input type="text" className="form-control" />

            <span className="input-group-btn">
              <button className="btn btn-primary" type="button"> Send </button>
            </span>

          </div>
        </div>

      </div>
    )
  };
}

export default Chat;
