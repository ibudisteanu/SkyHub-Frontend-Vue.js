/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';

import SocketStatusBar from './Socket-status-bar/HeaderBarSocketStatus.component';

import Link from '../../../Link/Link';

import PropTypes from 'prop-types';

import TopNavbar from './Top-navbar/TopNavbar';

class Header extends React.Component {

  static contextTypes = {
    refAuthenticationModal: PropTypes.any,
  };


  render() {

    //console.log("###### HEADER",this);

    return (

        <div className="row border-bottom">

          <TopNavbar />


          <SocketStatusBar />

        </div>

    );
  }
}

export default Header;
