/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/23/2017.
 * (C) BIT TECHNOLOGIES
 */

import Vue from 'vue'

import User from 'models/User/User.model';

export default {

    SET_AUTHENTICATED_USER_SESSION: (state, { sessionId }) => {
        state.sessionId = sessionId;
    },

    SET_AUTHENTICATED_NEW_USER_JSON: (state, { newUserData, sessionId }) => {
        let userLogged = new User( newUserData);
        state.user = userLogged;
        state.sessionId = sessionId;
    },

    SET_AUTHENTICATED_NEW_USER: (state, { newUser, sessionId }) => {
        state.user = newUser;
        state.sessionId = sessionId;
    },


    SET_USER_LOGOUT: (state, {  }) => {
        console.log('==== SET_USER_LOGOUT');
        state.sessionId = '';
        state.user =  new User({});
        state.error = ''
    },


}
