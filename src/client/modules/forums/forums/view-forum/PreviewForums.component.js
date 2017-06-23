/**
 * Created by BIT TECHNOLOGIES on 5/28/2017.
 */

import React from 'react';
import {connect} from "react-redux";

import {newRouterObjectArgumentAction} from '../../../../../my-redux/actions/RouterState.actions';

import AuthService from '../../../../services/REST/authentication/Auth.service.js';
import ForumsService from '../../../../services/REST/forums/forums/Forums.service';

import Forum from '../models/Forum.model';
import Link from '../../../../components/Link/Link';

/*
    PreviewForum can also work with a prop id="1_frm_3333", and it fetch automatically the forum from you
 */

 class PreviewForums extends React.Component {

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

    setForumArgument(){
    }

   renderForums(){
     const objects = this.props.contentState.contentForums.objects;
     if ((objects === null)||(typeof objects === "undefined")) return '';

     return (
       objects.map((object) =>
          <Link key={"link"+object.id} style={{marginLeft: 10}} to={object.URL} title={object.title}>
           <img src={object.iconPic} style={{backgroundColor: '#'+object.coverColor||"#79B0EC"}} />
           <span>{object.title}</span>
          </Link>
       )
     );
   }

    render() {

        return (

              <div className="lightBoxGallery">

                {::this.renderForums()}

              </div>

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

export default connect(mapState, mapDispatch)(PreviewForums);
