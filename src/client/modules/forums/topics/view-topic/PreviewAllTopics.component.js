/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/18/2017.
 * (C) BIT TECHNOLOGIES
 */


import React from 'react';
import {connect} from "react-redux";

import AuthService from '../../../../services/REST/authentication/Auth.service.js';
import ForumsService from '../../../../services/REST/forums/forums/Forums.service';

import Topic from '../models/Topic.model';
import Link from '../../../../components/Link/Link';

import PreviewTopic from './PreviewTopic.component';

/*
 PreviewTopic can also work with a prop id="1_frm_3333", and it fetch automatically the forum from you
 */

class PreviewAllTopics extends React.Component {

  constructor(props){
    super(props);
  }

  renderError(){
    return (
      <a title="Forums not found" data-gallery="">
        <img style={{backgroundColor: "red"}} />
        <span>Forum not found!</span>
      </a>
    )
  }

  renderTopics(){

    let objects = [];

    if (typeof this.props.topics !== "undefined")  objects = this.props.topics;
    else objects = this.props.contentState.contentObjects.objects;

    if ((objects === null)||(typeof objects === "undefined")||(objects === [])) return '';

    console.log("render topics::::: ",objects);

    return (
      objects.map((object) =>
        <PreviewTopic key={"previewTopic"+object.id} topic={object} />
      )
    );
  }


  render() {

    console.log(this.props.topics);

    return (

      <table className="table table-hover table-forums parent-table">
        <tbody>



          {
            this.props.hideHeader||false === true
            ?
              <tr>
              </tr>
            :
              <tr >
                <th>

                  <h3>
                      <i className="fa fa-comments table-forums-icon table-forums-icon" style={{paddingRight: 5}}></i> {this.props.title||''}
                  </h3>

                </th>
                <th><i className="fa fa-comments-o table-forums-icon" aria-hidden="true"></i></th>
                <th><i className="fa fa-eye table-forums-icon" aria-hidden="true"></i></th>
              </tr>
          }

          {::this.renderTopics()}


        </tbody>
      </table>
    );
  }
}

function mapState (state){
  return {
    userAuthenticated: state.userAuthenticated,
    contentState: state.contentState,
  }
};

function mapDispatch (dispatch) {
  return {
    dispatch : dispatch,
  }
};

export default connect(mapState, mapDispatch)(PreviewAllTopics);
