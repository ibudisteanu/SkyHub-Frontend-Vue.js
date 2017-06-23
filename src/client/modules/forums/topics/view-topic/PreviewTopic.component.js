/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/18/2017.
 * (C) BIT TECHNOLOGIES
 */

import React from 'react';
import {connect} from "react-redux";

import {newRouterObjectArgumentAction} from '../../../../../my-redux/actions/RouterState.actions';

import AuthService from '../../../../services/REST/authentication/Auth.service.js';
import ForumsService from '../../../../services/REST/forums/forums/Forums.service';

import ShowDate from '../../../../components/util-components/UI/show-date/ShowDate.component';

import Topic from '../models/Topic.model';
import Link from '../../../../components/Link/Link';

/*
 PreviewTopic can also work with a prop id="1_frm_3333", and it fetch automatically the forum from you
 */

class PreviewTopic extends React.Component {

  constructor(props){
    super(props);
  }

  renderError(){
    return (
      <a title="Forums not found" data-gallery="">
        <img style={{backgroundColor: "red"}} />
        <span>Topic not found!</span>
      </a>
    )
  }

  setTopicArgument(){

  }

  render() {

    //console.log("22222 preview topic",this.props.topic);

    console.log(this.props.topic);
    //console.log(this.props.topic.getImage(), this.props.topic.getTitle());
    //console.log(Topic.getImage(this.props.topic));

    if ((this.props.topic === null) ||(typeof this.props.topic === "undefined")) return this.renderError();

    return (


        <tr>
            <td id={"TopicTable_"+this.props.topic.id} className="anchor">

              <div className="anchor" style={{paddingLeft:42}}>

                  <Link key={"previewTopicLink"+this.props.topic.id} to={this.props.topic.URL} title={this.props.topic.title} disableLink={this.props.topic.preview}>

                    <img className="table-forums-topic-image" src={  Topic.getImage(this.props.topic) || "https://citation-beweb.netdna-ssl.com/img/compose.png" } alt={Topic.getTitle(this.props.topic)||'no title'} />

                    <h4 className="table-forums-topic-title">{Topic.getTitle(this.props.topic)||'no title'}</h4>

                    <br />

                    <p className="table-forums-topic-body word-wrap">
                      {Topic.getDescription(this.props.topic)||'no description'}
                    </p>

                  </Link>

              </div>


              <div style={{display: "inline"}}>

                {this.props.topic.authorId}

                <ShowDate date={this.props.topic.dtCreation} />

              </div>


              <br />

              <div className="topic-question-footer">

              </div>

            </td>
            <td>0<br /> </td>
            <td>0<br /> </td>
        </tr>
    );
  }
}

function mapState (state){
  return {
    userAuthenticated: state.userAuthenticated,
  }
};

function mapDispatch (dispatch) {
  return {
    dispatch : dispatch,
  }
};

export default connect(mapState, mapDispatch)(PreviewTopic);
