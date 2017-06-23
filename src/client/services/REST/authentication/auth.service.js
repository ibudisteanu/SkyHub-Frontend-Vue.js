/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/12/2017.
 * (C) BIT TECHNOLOGIES
 */

import CookiesService from '../../Cookies/Cookies.service';
import SocketService from '../../../../services/Communication/socket/Socket.service';
import User from '../../../../models/User/User.model';

import * as UserAuthenticatedActions from '../../../../my-redux/actions/UserAuthenticated.actions';

export class AuthServiceClass {

    dispatch = null;
    userAuthenticated = null;//from redux

    constructor() {

        console.log("      @@@ AUTH SERVICE CLASS");

    }

    startService(dispatch, userAuthenticated, SocketService){

      this.dispatch = dispatch;
      this.userAuthenticated = userAuthenticated;

      this.loadCookieUserDocumentReady();
    }

    loadCookieUserDocumentReady (){
        // this.loadCookieInterval = setInterval(::this.loadCookieUser,500);
        // this.loadCookieUser();
    }

    loadCookieUser ( ){

      if (this.userAuthenticated.user.isLoggedIn() === true) return; //already logged in

      if ((typeof window !== "undefined")&& (typeof window.document !== "undefined")){

          var sessionId = CookiesService.getSessionCookie();
          if (sessionId !== "")
              this.loginSessionAsync(sessionId);

          SocketService.setSocketReadObservable("connect").subscribe(response => {
              var sessionId = CookiesService.getSessionCookie();
              if (sessionId !== "")
                  this.loginSessionAsync(sessionId);
          });

          clearInterval(this.loadCookieInterval);
      }
    }

    loginAsync(sEmailUserName, sPassword) {

        this.logout();

        return new Promise( (resolve)=> {

            if (this.userAuthenticated.user.isLoggedIn() === true) { console.log("user already logged in"); resolve(true); return ;}; //already logged in

            //Using Promise
            SocketService.sendRequestGetDataPromise("auth/login",{emailUsername:sEmailUserName, password:sPassword}).then( (resData) => {

                console.log('Answer from Server Auth Login');
                console.log(resData);

                if(resData.result === true)
                    this.loginProvidingUser(resData.user, resData.sessionId);

                resolve(resData);

            });

        });

    }

    loginProvidingUser(userJSON, sessionId){
        let userLogged = new User( userJSON);
        this.dispatch(UserAuthenticatedActions.newUserAuthenticated(userLogged));

        CookiesService.setCookie('sessionId', sessionId, 365*5, '/');
        console.log('setting cookie   '+sessionId);
    }

    loginSessionAsync(sessionId){

        return new Promise( (resolve)=> {
            //Using Promise

            if (this.userAuthenticated.user.isLoggedIn() === true) { resolve(true); return ;}; //already logged in

            //SocketService.createClientSocket();
            SocketService.sendRequestGetDataPromise("auth/login-session",{sessionId: sessionId}).then( (resData ) => {

                console.log('Answer from Login sessionId Async');
                console.log(resData);

                if(resData.result == true) {

                    let userLogged = new User( resData.user);
                    this.dispatch(UserAuthenticatedActions.newUserAuthenticated(userLogged));
                }

                resolve(resData);

            });
        });
    }

    registerAsync(sUsername, sEmailAddress, sPassword, sFirstName, sLastName, sCountry, sLanguage, sCity, sLatitude, sLongitude, iTimeZone){

        return new Promise( (resolve)=> {

            //Using Promise
            SocketService.sendRequestGetDataPromise("auth/register",{email:sEmailAddress, username: sUsername, password: sPassword,
                firstName: sFirstName, lastName: sLastName, country: sCountry, language : sLanguage, city : sCity, latitude: sLatitude, longitude : sLongitude, timeZone : iTimeZone })

                .then( (resData ) => {

                console.log('Answer from Server Auth Register', resData);

                if(resData.result === true) {
                    this.loginAsync(sEmailAddress, sPassword);
                }

                resolve(resData);
            });

        });

    }

    registerOAuthAsync(sSocialNetworkName,sSocialNetworkId, sAccessToken, sEmail, sFirstName, sLastName,sProfilePic, sCoverImage, sCountryCode, sLanguage, sCity, latitude, longitude, sShortBio, iAge, sGender, iTimeZone, bVerified) {


        return new Promise( (resolve)=> {

            //Using Promise
            SocketService.sendRequestGetDataPromise("auth/register-oauth",{socialNetwork: sSocialNetworkName, socialNetworkId: sSocialNetworkId, accessToken : sAccessToken,
                email:sEmail, firstName: sFirstName, lastName: sLastName, profilePic : sProfilePic, coverPic : sCoverImage, country: sCountryCode, language:sLanguage, city : sCity,
                latitude: latitude, longitude : longitude,  shortBio: sShortBio, age : iAge, gender : sGender,   timeZone: iTimeZone, verified: bVerified,})

                .then( (resData ) => {

                    console.log('Answer from Oauth', resData);

                    if(resData.result === true) {
                        this.loginProvidingUser(resData.user, resData.sessionId);
                    }

                    resolve(resData);
                });

        });
    }

    logout(){

        console.log("LOGOUT");

        SocketService.sendRequest("auth/logout",{});

        CookiesService.deleteCookie("sessionId");
        this.dispatch(UserAuthenticatedActions.logoutUserAuthenticated());
    }

}


var AuthService = new AuthServiceClass();
export default AuthService;

// export default {
//   AuthService: AuthService,
//
//   createNewInstance: function () {
//     AuthService = new AuthServiceClass();
//   }
//
// }
