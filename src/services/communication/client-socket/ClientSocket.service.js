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
            //query: "token=aaa" //JWT Token
            query: "token=" + this.storeState.authenticatedUser.sessionId //JWT Token
        });

        this.setSocketReadObservable("connect").subscribe(response => {

            console.log('Client has connected to the server!');
            this.dispatch('SOCKET_CONNECTION_SUCCESSFULLY',{});
        });

        this.socket.on("connect_failed",function () {
            console.log('Connecting failed 222');
        });

        this.setSocketReadObservable("connect_error").subscribe(response => {
            console.log('Connecting Error', response);
            this.dispatch('SOCKET_CONNECTING_ERROR',{error: response});
        });

        this.socket.on("error",function () {
            console.log('error 222');
        });


        this.socket.on('api/news', function (res) {
            console.log('news');
            console.log(res);
        });

        // THE SAME CODE written but using OBSERVABLE
        this.setSocketReadObservable("connectionReady").subscribe(response => {

                console.log("Connection Ready: " + response);

                this.sendRequestObservable("version", '').subscribe(response => {

                    this.sServerSocketVersion = response.version;

                    console.log("API VERSION: " + response.version);
                });
            }
        );


        // Add a connect listener
        this.socket.on('api/message', function (data) {
            console.log('Received a message from the server!', data);
        });

        // Add a disconnect listener
        this.setSocketReadObservable("disconnect").subscribe(response => {

            console.log('The client has disconnected!');
            this.dispatch('SOCKET_DISCONNECTED', {});
        });
    }

    /*
     FUNCTIONS
     */

    sendRequest(sRequestName, requestData) {

        //console.log('sending 1'+sRequestName, requestData);

        if (!requestData.hasOwnProperty('sessionId')) {
          var sessionId = this.storeState.authenticatedUser.sessionId;

          if ((sessionId !== "") && (!requestData.hasOwnProperty('sessionId')) && (typeof requestData !== "string"))
            requestData.sessionId = sessionId;
        }

        //console.log('sending 2'+sRequestName, requestData);


        if ((sRequestName !== '') || (requestData !== ''))
            return this.socket.emit( constants.SERVICE_WEBSOCK_API + sRequestName, requestData);
    }

    /*
     Sending the Request and Obtain the Promise to Wait Async
     */
    sendRequestGetData(sRequestName, sRequestData, receivingSuffix) {

        if (typeof receivingSuffix === 'undefined') receivingSuffix = '';

        return new Promise((resolve) => {

            this.sendRequest(sRequestName, sRequestData);

            this.socket.once(constants.SERVICE_WEBSOCK_API + sRequestName + (receivingSuffix !== '' ? '/'+receivingSuffix : ''), function (resData) {

                /*console.log('SOCKET RECEIVED: ');
                 console.log(resData);*/

                resolve(resData);

            });

        });
    }

    /*
     Sending Request and Obtain the Observable Object
     */
    sendRequestObservable(sRequestName, sRequestData) {

        var result = this.sendRequest(sRequestName, sRequestData);

        return this.setSocketReadObservable(sRequestName);
    }

    setSocketReadObservable(sRequestName) {

        if ((sRequestName !== "connect") && (sRequestName !== "disconnect") && (sRequestName !== 'connect_failed')&&(sRequestName !== 'connect_error'))
            sRequestName = constants.SERVICE_WEBSOCK_API + sRequestName;

        //let observable = new Observable < Object > (observer => {
        let observable = Observable.create(observer => {
                this.socket.on(sRequestName, (data) => {
                    observer.next(data);
                });
            });

        //console.log("OBSERVABLE for "+sRequestName,observable,);
        return observable;
    }

}

export default new ClientSocketServiceClass();