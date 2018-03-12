/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/23/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService'
import CookiesService from 'services/cookies/cookies.service';

import User from 'models/User/User.model';

export default {
    // ensure data for rendering given list type


    AUTHENTICATE_USER_BY_LOGIN: async ({ commit, dispatch, state, getters }, { sEmailUserName, sPassword }) => {

        await dispatch('AUTHENTICATE_LOGOUT_USER', {});

        if (getters.isUserLoggedIn(state.user) === true) { console.log("user already logged in"); return {result:true, user:state.user} }; //already logged in

        let resData = await FetchService.sendRequestWaitOnce("auth/login",{emailUsername:sEmailUserName, password:sPassword});

        console.log('Answer from Server Auth Login', resData);

        if(resData.result === true) {
            resData.user.loggedIn = true;
            await dispatch('AUTHENTICATE_USER_BY_PROVIDING_USER', { userJSON: resData.user,  sessionId: resData.sessionId });
        }

        return(resData);

    },

    AUTHENTICATE_USER_BY_SESSION: async ({ commit, dispatch, state, getters }, { sessionId }) => {

        if ((getters.isUserLoggedIn(state.user) === true)&&((typeof sessionId === "undefined")||(sessionId.length < 5))) {   //Invalid Session ID
            await dispatch('AUTHENTICATE_LOGOUT_USER', {});
            return {result:false };
        }

        if ((typeof sessionId === 'undefined')||(sessionId.length <= 3)){ //invalid sessions
            return {result:false, message: 'sessionId is empty'};
        }

        // if (getters.isUserLoggedIn(state.user) === true) {     //already logged in
        //     return ( {result: true, user: state.user, sessionId: sessionId});
        // }

        console.log('Fetching session', sessionId, state.user.lastName);
        let resData = await FetchService.sendRequestWaitOnce("auth/login-session", {sessionId: sessionId });

        console.log('Answer from Login sessionId Async', resData.result, state.user.lastName);

        if (resData.result === true) {
           CookiesService.setCookie('sessionId', sessionId, 365*5, '/');
           await commit('SET_AUTHENTICATED_USER_SESSION', {sessionId: sessionId});

           resData.user.loggedIn = true;

           await commit('SET_AUTHENTICATED_NEW_USER_JSON', { newUserData: resData.user});
        }

        return resData;
    },

    AUTHENTICATE_USER_BY_PROVIDING_USER:  async ({ commit, dispatch, state }, { userJSON, sessionId }) => {

        CookiesService.setCookie('sessionId', sessionId, 365*5, '/');
        await commit('SET_AUTHENTICATED_USER_SESSION', {sessionId: sessionId});

        return await commit('SET_AUTHENTICATED_NEW_USER_JSON',{ newUserData: userJSON});

    },


    AUTHENTICATE_LOGOUT_USER: async ({ commit, dispatch, state }, { }) => {

        console.log("LOGOUT ACTION");

        FetchService.sendRequestWaitOnce("auth/logout",{userId: state.user.id||''});

        CookiesService.deleteCookie("sessionId");
        await commit('SET_AUTHENTICATED_USER_SESSION', {sessionId: ''});

        return commit('SET_USER_LOGOUT', {});
    },


    AUTHENTICATE_REGISTER: async ({ commit, dispatch, state }, { sUsername, sEmailAddress, sPassword, sFirstName, sLastName, sCountry, sLanguage, sCity, sLatitude, sLongitude, iTimeZone }) => {

        //Using Promise
        let resData = await FetchService.sendRequestWaitOnce("auth/register", {
            email: sEmailAddress,
            username: sUsername,
            password: sPassword,
            firstName: sFirstName,
            lastName: sLastName,
            country: sCountry,
            language: sLanguage,
            city: sCity,
            latitude: sLatitude,
            longitude: sLongitude,
            timeZone: iTimeZone
        });

        console.log('Answer from Server Auth Register', resData);

        if (resData.result === true) {
            resData.user.loggedIn = true;
            await dispatch('AUTHENTICATE_USER_BY_LOGIN',{sEmailUserName:sEmailAddress, sPassword: sPassword});
        }

        return resData;

    },

    AUTHENTICATE_REGISTER_OAUTH: async ({ commit, dispatch, state }, { sSocialNetworkName,sSocialNetworkId, sAccessToken, sEmail, sFirstName, sLastName,sProfilePic, sCoverImage, sCountryCode, sLanguage, sCity, latitude, longitude, sShortBio, iAge, sGender, iTimeZone, bVerified }) => {

        let resData = await FetchService.sendRequestWaitOnce("auth/register-oauth", {
            socialNetwork: sSocialNetworkName,
            socialNetworkId: sSocialNetworkId,
            accessToken: sAccessToken,
            email: sEmail,
            firstName: sFirstName,
            lastName: sLastName,
            profilePic: sProfilePic,
            coverPic: sCoverImage,
            country: sCountryCode,
            language: sLanguage,
            city: sCity,
            latitude: latitude,
            longitude: longitude,
            shortBio: sShortBio,
            age: iAge,
            gender: sGender,
            timeZone: iTimeZone,
            verified: bVerified,
        });

        console.log('Answer from Oauth', resData);

        if ((resData !== null)&&(resData.result === true)) {
            resData.user.loggedIn = true;
            await dispatch('AUTHENTICATE_USER_BY_PROVIDING_USER',{userJSON: resData.user, sessionId: resData.sessionId});
        }

        return resData;

    },

}

