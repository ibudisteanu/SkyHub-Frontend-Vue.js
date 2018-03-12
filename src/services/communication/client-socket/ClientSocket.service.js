/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/6/2017.
 * (C) BIT TECHNOLOGIES
 */

import * as io from 'socket.io-client';

import { Observable, Subscribable } from 'rxjs/Observable';

var constants = require('root/constants.js');

class ClientSocketServiceClass {

    constructor() {

        this.sServerSocketVersion = "";

        console.log('               @@@@@@ Socket Client constructor', this);

    }

    startService(dispatch, storeState){
      this.dispatch = dispatch;
      this.storeState = storeState;

      this.createClientSocket();
    }


    createClientSocket() {

        this.socket = io.connect( constants.SERVICE_WEBSOCK_URL, {
            query: "token=" + this.storeState.authenticatedUser.sessionId
        });

        this.socket.on("connect", ()=> {
            console.log('Client has connected to the server!');
            this.dispatch('SOCKET_CONNECTION_SUCCESSFULLY',{});
        });

        this.socket.on("connect_failed", () => {
            console.log('Connecting failed 222');
        });

        this.socket.on("connect_error", (response) => {
            console.log('Connecting Error', response);
            this.dispatch('SOCKET_CONNECTING_ERROR',{error: response});
        });

        this.socket.on("error",() => {
            console.log('error 222');
        });

        // THE SAME CODE written but using OBSERVABLE
        this.socket.on(constants.SERVICE_WEBSOCK_API+"connectionReady", (response) => {
            console.log("Connection Ready: " + response);

            this.socket.on(constants.SERVICE_WEBSOCK_API+"version", (response) => {

                this.sServerSocketVersion = response.version;

                console.log("API VERSION: " + response.version);
            });
            }
        );

        // Add a disconnect listener
        this.socket.on("disconnect", (response) => {

            console.log('The client has disconnected!');
            this.dispatch('SOCKET_DISCONNECTED', {});
        });
    }

    /*
     FUNCTIONS
     */

    sendRequest(sRequestName, requestData) {

        //console.log('sending 1'+sRequestName, requestData, this.storeState.authenticatedUser.sessionId);

        if (!requestData.hasOwnProperty('sessionId')) {
          var sessionId = this.storeState.authenticatedUser.sessionId;

          if ((sessionId !== "") && (!requestData.hasOwnProperty('sessionId')) && (typeof requestData !== "string"))
            requestData.sessionId = sessionId;
        }

        if ((sRequestName !== '') || (requestData !== ''))
            return this.socket.emit( constants.SERVICE_WEBSOCK_API + sRequestName, requestData);
    }

    /*
     Sending the Request and Obtain the Promise to Wait Async
     */
    sendRequestWaitOnce(sRequestName, sRequestData, receivingSuffix) {

        if (typeof receivingSuffix === 'undefined') receivingSuffix = '';

        return new Promise((resolve) => {

            this.sendRequest(sRequestName, sRequestData);

            this.socket.once(constants.SERVICE_WEBSOCK_API + sRequestName + (receivingSuffix !== '' ? '/'+receivingSuffix : ''),  (resData) => {

                resolve(resData);

            });

        });
    }

    /*
         Sending the Request and Obtain the Promise to Wait Async
     */
    sendRequestOn(sRequestName, sRequestData, receivingSuffix, callback) {

        if (typeof receivingSuffix === 'undefined') receivingSuffix = '';

        this.sendRequest(sRequestName, sRequestData);

        this.socket.on(constants.SERVICE_WEBSOCK_API + sRequestName + (receivingSuffix !== '' ? '/'+receivingSuffix : ''),  callback );

    }

}

export default new ClientSocketServiceClass();