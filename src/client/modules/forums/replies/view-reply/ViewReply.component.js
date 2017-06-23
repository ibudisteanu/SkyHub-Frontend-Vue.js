/**
 * Created by BIT TECHNOLOGIES on 5/28/2017.
 */

import React from 'react';
import {connect} from "react-redux";

import AuthService from '../../../../services/REST/authentication/auth.service.js';
import ForumsService from '../../../../services/REST/forums/forums/forums.service';

import Link from '../../../../components/Link/Link';

/*
    PreviewForum can also work with a prop id="1_frm_3333", and it fetch automatically the forum from you
 */

 class ViewReply extends React.Component {

    constructor(props){
        super(props);
    }

    renderError(){
        return (
          <a title="Replies not found" data-gallery="">
            <img style={{backgroundColor: "red"}} />
            <span>Forum not found!</span>
          </a>
        )
    }

    setForumArgument(){
    }

   sBackgroundColor = 'yellow';
   sTextColor = 'black';

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
   //
   // renderStatusBar () {
   //   <nav className='navbar navbar-default' style={{display: 'inline-block', width: '100%', marginBottom: -5, minHeight: 16, background: this.sBackgroundColor }} >
   //
   //     <div style={{textAlign: 'center', margiTop: 5, color: this.sTextColor}}>
   //       <p>  { ( this.props.author.getName() === '' ?  this.props.author.username :this.props.author.getName() ) } , {this.props.author.shortBio}</p>
   //       <a href="#"><b style={{color: this.sTextColor}}>{ this.props.author.username }</b></a>
   //     </div>
   //
   //   </nav>
   //
   // }
     render() {


        console.log("5555555555555555555555555555555555555 ", this.props.author.getName());
      // this.renderStatusBar();

        return (


          <div className="media">
            <a className="forum-avatar" href="#">
              <img src= {this.props.author.profilePic} className="img-circle" alt="image" />
              <div className="author-info">
                <strong>Posts:</strong> 542<br />
                <strong>Joined:</strong> April 11.2015<br />
              </div>
            </a>

            <div className="media-body">
              <h4 className="media-heading">{this.props.title || '' } </h4>
              <p>  { ( this.props.author.getName() === '' ?  this.props.author.username :this.props.author.getName() ) } , {this.props.author.shortBio}</p>
              <p>   {this.props.body||''}</p>
            </div>

          </div >





          // add here topic yellow selector
  //       <p> User +  ( this.props.author.getName() === '' ?  this.props.author.username :this.props.author.getName() ) added at this.props.dtLastActivity +
    //  ' the title ' +  this.props.title() +<br> this.props.body) </br> </p>
        );
    }
}

function mapState (state){
  return {
    userAuthenticated: state.userAuthenticated,
    contentState: state.contentState,
  }
}

function mapDispatch (dispatch) {
  return {
    dispatch : dispatch,
  }
}
export default connect(mapState, mapDispatch)(ViewReply);
