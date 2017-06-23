/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/8/2017.
 * (C) BIT TECHNOLOGIES
 */

import React from 'react';
import PropTypes from 'prop-types';
import Link from '../../../../Link/Link';

import HeaderNavigationMenu from './Header-Navigation-Menu/HeaderNavigationMenu';

class TopNavbar extends React.Component {

  static contextTypes = {
    refAuthenticationModal: PropTypes.any,
  };

  render() {

    //console.log("###### TOP NAVBAR",this);

    return (
      <div className="row border-bottom">
        <nav className="navbar navbar-static-top white-bg" role="navigation" style={{marginBottom: 0}}>

          <div className="navbar-header">
            <a className="navbar-minimalize minimalize-styl-2 btn btn-primary " href="#"><i className="fa fa-bars"></i> </a>
            <form role="search" className="navbar-form-custom" action="http://webapplayers.com/inspinia_admin-v2.7.1/search_results.html">
              <div className="form-group">
                <input type="text" placeholder="Search for something..." className="form-control" name="top-search" id="top-search" />
              </div>
            </form>
          </div>


          <HeaderNavigationMenu />

        </nav>
      </div>
    );
  }
}

export default TopNavbar;

