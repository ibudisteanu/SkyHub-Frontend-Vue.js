/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/6/2017.
 * (C) BIT TECHNOLOGIES
 */

import CookiesService from '../../cookies/cookies.service';
import axios from 'axios';

//import { Configuration } from '../app.constants';

class HTTPServiceClass {

    serverHTTP = "http://myskyhub.ddns.net:4000/";
    serverHTTPApi = this.serverHTTP+"api/";

    constructor() {

        console.log("Creating HTTP Service");

    }

    async sendRequestGetData(sRequest, requestData){

      if (!requestData.hasOwnProperty('sessionId')) {
        let sessionId = CookiesService.getSessionCookie();

        if ((sessionId !== "") && (!requestData.hasOwnProperty('sessionId')) && (typeof requestData !== "string"))
          requestData.sessionId = sessionId;
      }

      console.log(""); console.log(""); console.log(""); console.log(this.addTrailingSlash(this.serverHTTPApi)+sRequest);  console.log(requestData);

      requestData = {data: requestData};

      let answer = await axios.get(this.addTrailingSlash(this.serverHTTPApi)+sRequest, requestData);
      return answer.data;
    }

    async sendRequestGetDataURL(sRequest, req){
      req = {data: req};

      let answer = await axios.get(sRequest, req);
      return answer.data;
    }


    async postRequest(sRequest, requestData){

      if (!requestData.hasOwnProperty('sessionId')) {
        let sessionId = CookiesService.getSessionCookie();

        if ((sessionId !== "") && (!requestData.hasOwnProperty('sessionId')) && (typeof requestData !== "string"))
          requestData.sessionId = sessionId;
      }

      let answer = await axios.post(this.addTrailingSlash(this.serverHTTPApi)+sRequest, requestData);
      return answer.data;
    }

    async checkAuthCookie(cookie){

      let sessionId = '';

      //based on this https://stackoverflow.com/questions/3393854/get-and-set-a-single-cookie-with-node-js-http-server
      cookie && cookie.split(';').forEach( function( cookie ) {
        let parts = cookie.split('=');

        let cookieName = parts.shift().trim();

        if (cookieName === 'sessionId')
          sessionId = decodeURI(parts.join('='));

      });

      if ((sessionId !== '')&&(sessionId.length > 5)){

        return await this.sendRequestGetData("auth/login-session", {sessionId: sessionId});

      } else {
        return {
          data: {
            result: false,
            message: "cookie invalid",
          }
        }
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

// module.exports = {
//     HTTPService : new HTTPServiceClass(),
// }
