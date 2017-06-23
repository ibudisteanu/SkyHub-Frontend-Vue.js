

import React from 'react';

import PropTypes from 'prop-types';

import AuthenticatedHeaderNavigationMenu from './AuthenticatedHeaderNavigationMenu';
import NotAuthenticatedHeaderNavigationMenu from './NotAuthenticatedHeaderNavigationMenu';

import {connect} from 'react-redux';

class HeaderNavigationMenu extends React.Component {

  constructor(props){
    super(props);
  }

  static contextTypes = {
    refAuthenticationModal: PropTypes.any,
    userAuthenticated: PropTypes.object,
  };

  renderNavigationAuthenticated(){

    return(
      <AuthenticatedHeaderNavigationMenu />
    )

  }

  renderNavigationNotAuthenticated(){

    return (
      <NotAuthenticatedHeaderNavigationMenu />
    )

  }

  render() {

    //console.log("###### HEADER NAVIGATION",this);

    if ((typeof this.context.userAuthenticated !== "undefined")&&(this.context.userAuthenticated.user !== null)) {

      if (this.context.userAuthenticated.user.isLoggedIn()) return ::this.renderNavigationAuthenticated();

    }

    return ::this.renderNavigationNotAuthenticated();


  }
}

function mapState (state){
  return {
    userAuthenticated : state.userAuthenticated,
  }
};

function mapDispatch (dispatch) {
  return {
    dispatch : dispatch,
  }
};


export default HeaderNavigationMenu;

