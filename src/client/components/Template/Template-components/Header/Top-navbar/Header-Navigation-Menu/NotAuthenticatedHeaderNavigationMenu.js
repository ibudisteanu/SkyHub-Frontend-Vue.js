/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/10/2017.
 * (C) BIT TECHNOLOGIES
 */



import React from 'react';
import Link from '../../../../../Link/Link';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class NotAuthenticatedHeaderNavigationMenu extends React.Component {

  // static contextTypes = {
  //   refAuthenticationModal: PropTypes.any,
  // };

  handleSignIn(e){
    e.preventDefault(); e.stopPropagation();
    console.log("SIGN IN");


    if ((this.props.routerState !== null)&&(this.props.routerState.refAuthenticationModal !== null))
      this.props.routerState.refAuthenticationModal.openLogin();

    //using props & context
    // if ((this.context.refAuthenticationModal !== null)&&(typeof this.context.refAuthenticationModal !== "undefined"))
    //   this.context.refAuthenticationModal.openLogin();
  }

  handleRegister(e){
    e.preventDefault(); e.stopPropagation();

    if ((this.props.routerState !== null)&&(this.props.routerState.refAuthenticationModal !== null))
      this.props.routerState.refAuthenticationModal.openRegistration();

    // if ((this.context.refAuthenticationModal !== null)&&(typeof this.context.refAuthenticationModal !== "undefined"))
    //   this.context.refAuthenticationModal.openRegistration();
  }


  render() {

    //console.log("######## NOT AUTHENTICATED HEADER", this);

    return (


      <ul className="nav navbar-top-links navbar-right">

        <li>
          <Link to="/">
            <i className="fa fa-home"></i>
            <span className="m-r-sm text-muted welcome-message">Home</span>
          </Link>
        </li>



        <li>
          <Link to="/login" onClick={::this.handleSignIn}>
            <i className="fa fa-sign-in"></i>
            <span className="m-r-sm text-muted welcome-message">Log in</span>
          </Link>
        </li>

        <li>
          <Link to="/register" onClick={::this.handleRegister}>
            <i className="fa fa-user-plus"></i>
            <span className="m-r-sm text-muted welcome-message">Register</span>
          </Link>
        </li>




      </ul>
    );
  }
}


function mapState (state){
  return {
    routerState: state.routerState,
  }
};

function mapDispatch (dispatch) {
  return {
    dispatch : dispatch,
  }
};

export default connect(mapState, mapDispatch)(NotAuthenticatedHeaderNavigationMenu);
