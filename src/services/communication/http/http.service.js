/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/6/2017.
 * (C) BIT TECHNOLOGIES
 */

import axios from 'axios';

//import { Configuration } from '../app.constants';

class HTTPServiceClass {

    constructor() {

        this.serverHTTP = "http://myskyhub.ddns.net:4000/";
        this.serverHTTPApi = this.serverHTTP+"api/";

        console.log("Creating HTTP Service");

    }

    startService(dispatch, storeState){
        this.dispatch = dispatch;
        this.storeState = storeState;
    }

    async sendRequestGetData(sRequest, requestData){

        if (typeof requestData.sessionId === "undefined") {
            let sessionId = this.storeState.authenticatedUser.sessionId;

            if ((sessionId !== "") && (typeof requestData !== "string"))
                requestData.sessionId = sessionId;
        }

        // console.log(""); console.log(""); console.log(""); console.log(this.addTrailingSlash(this.serverHTTPApi)+sRequest);  console.log(requestData);
        // console.log(this.storeState.sessionId);

        requestData = {data: requestData};

        try{
            let answer = await axios.get(this.addTrailingSlash(this.serverHTTPApi)+sRequest, requestData);
            return answer.data;
        } catch(Exception){
            return {result:false, message: "Can not connect to the server "+ this.serverHTTPApi+ " . Error: "+Exception.toString()};
        }
    }

    async sendRequestGetDataURL(sRequest, req){

        req = {data: req};

        try{
            let answer = await axios.get(sRequest, req);
            return answer.data;
        } catch (Exception){
            return {result:false, message: "Can not connect to the server "+ this.serverHTTPApi+ " . Error: "+Exception.toString()};
        }

    }


    async postRequest(sRequest, requestData){

        if (typeof requestData.sessionId === "undefined") {
            var sessionId = this.storeState.authenticatedUser.sessionId;

            if ((sessionId !== "") && (typeof requestData !== "string"))
                requestData.sessionId = sessionId;
        }
    
        try{
            let answer = await axios.post(this.addTrailingSlash(this.serverHTTPApi)+sRequest, requestData);
            return answer.data;            
        } catch(Exception){
            return {result:false, message: "Can not connect to the server "+ this.serverHTTPApi+ " . Error: "+Exception.toString()};
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

var HTTPServiceInstance = new HTTPServiceClass();
export default HTTPServiceInstance;
