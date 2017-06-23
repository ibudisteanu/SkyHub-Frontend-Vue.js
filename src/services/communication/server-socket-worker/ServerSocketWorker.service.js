/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/24/2017.
 * (C) BIT TECHNOLOGIES
 */

var io = require ('socket.io-client');
var rxjsObservable = require ('rxjs/Observable');
//import { Observable, Subscribable } from 'rxjs/Observable';

class ServerSocketWorkerServiceClass {

    constructor() {
        this.socket = null;

        this.sServerSocketAddress = "myskyhub.ddns.net:4000/";
        this.sServerSocketApi = "api/";

        this.sServerSocketVersion = "";

        console.log('               @@@@@@ Socket Worker Client constructor');
    }

    startService() {
        this.createClientWorkerSocket();
    }

    createClientWorkerSocket() {

        console.log("Trying to create Worker Socket ...");

        this.socket = io.connect(this.sServerSocketAddress , {
            //transports: [ 'xhr-polling' ],
            //transports: ['xhr-multipart'],
            //transports: ['polling'],
            //transports: ['websocket'],
            //transports: ['websocket', 'polling'],
            port:4000,
            query: "token=" + "xxxx" //JWT Token
        } );

        this.setSocketReadObservable("connect").subscribe(response => {
            console.log('SocketWorker has connected to the server!');
        });

        this.socket.on("connect_failed",function (err) {
            console.log('SocketWorker Connecting failed 222', err);
        });

        this.socket.on("connect_error", function (error) {
            console.log('SocketWorker Connecting Error ', error);
        });

        this.socket.on("error",function (err) {
            console.log('SocketWorker error 222',err);
        });

        // THE SAME CODE written but using OBSERVABLE
        this.setSocketReadObservable("connectionReady").subscribe(response => {

                console.log("SocketWorker Connection Ready: " + response);

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
            console.log('SocketWorker has disconnected!');
        });
    }


    sendRequest(sRequestName, requestData) {

        //console.log('sending'+sRequestName); console.log(sRequestData);

        if ((sRequestName !== '') || (requestData !== ''))
            return this.socket.emit(this.sServerSocketApi + sRequestName, requestData);
    }

    /*
     Sending the Request and Obtain the Promise to Wait Async
     */
    sendRequestGetData(sRequestName, sRequestData) {
        return new Promise((resolve) => {

            this.sendRequest(sRequestName, sRequestData);

            this.socket.once(this.sServerSocketApi + sRequestName, function (resData) {

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
            sRequestName = this.sServerSocketApi + sRequestName;

        //let observable = new Observable < Object > (observer => {
        let observable = Observable.create(observer => {
            this.socket.on(sRequestName, (data) => {
                observer.next(data);
            });
        });

        //console.log("SocketWorker OBSERVABLE for "+sRequestName,observable,);
        return observable;
    }

}

var ServerSocketWorkerService = new ServerSocketWorkerServiceClass();
module.export = ServerSocketWorkerService;