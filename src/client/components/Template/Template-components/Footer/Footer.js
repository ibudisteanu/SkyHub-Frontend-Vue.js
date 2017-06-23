/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Link from '../../../Link/Link';

class Footer extends React.Component {

  render() {
    return (

      <div className="footer" style={{zIndex:200, marginLeft:0, position: "inherit"}}>

        <div style={{textAlign:"right"}}>

          <Link style={{marginLeft: 10}} to="/">Home</Link>

          <Link style={{marginLeft: 10}} to="/admin">Admin</Link>

          <Link style={{marginLeft: 10}} to="/privacy">Privacy</Link>

          <Link style={{marginLeft: 10}} to="/not-found">Not Found</Link>

          <Link style={{marginLeft: 10}} to="/about">About</Link>

          <Link style={{marginLeft: 10}} to="/contact">Contact</Link>

        </div>

        <div style={{textAlign:"center"}}>
          <strong>Copyright</strong> SkyHub 2016-2017 by <a href="http://bit-technologies.net/"> BIT TECHNOLOGIES </a>
        </div>

      </div>

    );
  }
}

export default Footer;
