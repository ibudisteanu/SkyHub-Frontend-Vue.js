/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';

// external-global styles must be imported in your JS.

import Body from '../Template-components/Body';
import Feedback from '../../Feedback/Feedback';

import ViewReply from '../../../modules/forums/replies/view-reply/ViewReply.component';

import {connect} from 'react-redux';

import {startLocalizationFetchingAsync} from './../../../../my-redux/actions/Localization.actions';
import User from "../../../modules/users/models/User.model";
import Header from "../Template-components/Header/Header";

class Layout extends React.Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  static contextTypes = {
    SocketService : PropTypes.object,
    AuthService : PropTypes.object,
  };

  static childContextTypes = {
    userAuthenticated: PropTypes.any,
  };


  getChildContext() {
    return {
      userAuthenticated: this.props.userAuthenticated,
    }
  };

  constructor(props){

    super(props);
  }

  async componentDidMount() {
   // this.props.dispatch(startLocalizationFetchingAsync());

    requestAnimationFrame(() => { //Make sure it is on client only



    });

  }


  render() {

    //console.log("################### Layout",this);


    return (


      <div id="wrapper">



        <Body>

          Country: {this.props.localization.country}

          {this.props.children}


          <ViewReply

            title="Nice document title"
            body="Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum,
             Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32."
            author = { new User({id: 'xxx',firstName: 'first name', lastName: 'last name', shortBio:'biografie',
              profilePic:'http://webapplayers.com/inspinia_admin-v2.7.1/img/a1.jpg'}) }
          />

        </Body>





      </div>
    );
  }
}



function mapState (state){
  return {
    localization: state.localization,
    userAuthenticated: state.userAuthenticated,
  }
};

function mapDispatch (dispatch) {
  return {
    dispatch : dispatch,
  }
};


export default connect(mapState, mapDispatch)(Layout);

