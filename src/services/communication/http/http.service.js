/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/6/2017.
 * (C) BIT TECHNOLOGIES
 */

import axios from 'axios';

var constants = require('root/constants.js');

class HTTPServiceClass {

    constructor() {
        console.log("Creating HTTP Service");
    }

    startService(dispatch, storeState){
        this.dispatch = dispatch;
        this.storeState = storeState;
    }

    async sendRequestWaitOnce(sRequest, requestData){

        if (typeof requestData.sessionId === "undefined") {
            let sessionId = this.storeState.authenticatedUser.sessionId;

            if ((sessionId !== "") && (typeof requestData !== "string"))
                requestData.sessionId = sessionId;
        }

        // console.log(""); console.log(""); console.log(""); console.log(this.addTrailingSlash(constants.SERVICE_HTTP_API_URL)+sRequest);  console.log(requestData);
        // console.log(this.storeState.sessionId);

        requestData = {data: requestData};

        try{
            let answer = await axios.get( this.addTrailingSlash(constants.SERVICE_HTTP_API_URL)+sRequest, requestData );
            return answer.data;
        } catch(Exception){
            return {result:false, message: "Can not connect to the server "+ constants.SERVICE_HTTP_API_URL+ " . Error: "+Exception.toString()};
        }
    }

    async sendRequestWaitOnceURL(sRequest, req){

        req = {data: req};

        try{
            let answer = await axios.get(sRequest, req);
            return answer.data;
        } catch (Exception){
            return {result:false, message: "Can not connect to the server "+ constants.SERVICE_HTTP_API_URL+ " . Error: "+Exception.toString()};
        }

    }


    async postRequest(sRequest, requestData){

        if (typeof requestData.sessionId === "undefined") {
            var sessionId = this.storeState.authenticatedUser.sessionId;

            if ((sessionId !== "") && (typeof requestData !== "string"))
                requestData.sessionId = sessionId;
        }
    
        try{
            let answer = await axios.post(this.addTrailingSlash(constants.SERVICE_HTTP_API_URL)+sRequest, requestData);
            return answer.data;            
        } catch(Exception){
            return {result:false, message: "Can not connect to the server "+ constants.SERVICE_HTTP_API_URL+ " . Error: "+Exception.toString()};
        }
    }


    addTrailingSlash(url){
        var lastChar = url.substr(-1); // Selects the last character
        if (lastChar != '/') {         // If the last character is not a slash
            url = url + '/';            // Append a slash to it.
        }
        return url;
    }

}

export default new HTTPServiceClass();
