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
import { Provider as ReduxProvider } from 'react-redux';

import {startLocalizationFetchingAsync} from './../my-redux/actions/Localization.actions';

//Creating the Socket Service
import SocketService from '../services/Communication/socket/Socket.service';
import AuthService from './services/REST/authentication/Auth.service';
import ForumsService from './services/REST/forums/forums/Forums.service';
import ContentService from './services/REST/forums/content/Content.service';


import {connect} from 'react-redux';

const ContextType = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: PropTypes.func.isRequired,
  // Integrate Redux
  // http://redux.js.org/docs/basics/UsageWithReact.html
  SocketService : PropTypes.object,
  AuthService : PropTypes.object,

  ...ReduxProvider.childContextTypes,
};

/**
 * The top-level React component setting context (global) variables
 * that can be accessed from all the child components.
 *
 * https://facebook.github.io/react/docs/context.html
 *
 * Usage example:
 *
 *   const context = {
 *     history: createBrowserHistory(),
 *     store: createStore(),
 *   };
 *
 *   ReactDOM.render(
 *     <App context={context}>
 *       <Layout>
 *         <LandingPage />
 *       </Layout>
 *     </App>,
 *     container,
 *   );
 */
class App extends React.PureComponent {

  static propTypes = {
    context: PropTypes.shape(ContextType).isRequired,
    children: PropTypes.element.isRequired,

    SocketService: PropTypes.object,
  };

  static childContextTypes = ContextType;

  getChildContext() {
    return {
      ...this.props.context,
      SocketService : SocketService,
      AuthService : AuthService,
    };
  }

  constructor(props){

    super(props);

  }



  bInitialized = false;
  AuthService = null;

  initializeClientApp(){

    if (this.bInitialized) return;
    this.bInitialized = true;

    console.log("APP",this.props);

    //Async Localization in case I don't have anything there
    this.props.context.store.dispatch(startLocalizationFetchingAsync());

    //Creating the Socket Service
    SocketService .startService(this.props.context.store.dispatch);

    AuthService.startService(this.props.context.store.dispatch, this.props.context.store.getState().userAuthenticated);

    ForumsService.startService(this.props.context.store.dispatch);

    ContentService.startService(this.props.context.store.dispatch, this.props.context.store.getState().contentState);

  }

  componentDidMount(){

    requestAnimationFrame(() => { //Make sure it is on client only

      this.setState({appIsMounted: true});

    });
  }

  render() {
    if (process.env.BROWSER) {
      console.log("APP RENDERED FIRST");
      this.initializeClientApp();
    }
    // NOTE: If you need to add or modify header, footer etc. of the app,
    // please do that inside the Layout component.
    return React.Children.only(this.props.children);
  }

}



export default (App);
