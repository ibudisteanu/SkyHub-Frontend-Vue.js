/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import {connect} from 'react-redux';

import Link from '../../../Link/Link';

import PropTypes from 'prop-types';

import Header from '../Header/Header';
import LeftSidebar from './Left-sidebar/LeftSidebar';
import RightSidebar from './Right-sidebar/RightSidebar';
import Content from './Content/Content';
import Footer from '../Footer/Footer';
import StickyButtons from './Sticky-buttons/StickyButtons.component';

import AuthenticationModal from '../../../../modules/users/authentication/modals/Authentication.modal';
import {setAuthenticationModalElement} from './../../../../../my-redux/actions/RouterState.actions.js';

class Body extends React.Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  static childContextTypes = {
    refAuthenticationModal: PropTypes.any,
  };

  getChildContext() {
    return {
      refAuthenticationModal: this.refAuthenticationModal,
    }
  };

  componentDidMount() {
    requestAnimationFrame(() => { //Make sure it is on client only

      this.props.dispatch(setAuthenticationModalElement(this.refAuthenticationModal));

    });
  }

  refAuthenticationModal = null;

  render() {

    //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXX BODYY", this);

    return (
      <div >

        <LeftSidebar />

        <div id="page-wrapper" className="gray-bg" style={{minHeight: 785}}>

          <Header />


          <Content>
            {this.props.children}

            <AuthenticationModal ref={(c) => this.refAuthenticationModal = c}  />


          </Content>



        </div>

        <Footer />
        <StickyButtons />

        <RightSidebar />

      </div>
    );
  }
}


function mapState (state){
  return {
    userAuthenticated : state.userAuthenticated,
    localization: state.localization,
  }
};

function mapDispatch (dispatch) {
  return {
    dispatch : dispatch,
  }
};


export default connect(mapState, mapDispatch)(Body);
