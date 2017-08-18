/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/23/2017.
 * (C) BIT TECHNOLOGIES
 */

import Vue from 'vue'

import User from 'models/User/User.model';

export default {

    SET_AUTHENTICATED_USER_SESSION: (state , { sessionId }) => {
        if (typeof sessionId === 'undefined') sessionId = '';
        state.sessionId = sessionId;
    },

    SET_AUTHENTICATED_NEW_USER_JSON: (state, { newUserData}) => {
        let userLogged = new User( newUserData);
        state.user = userLogged;

    },

    SET_AUTHENTICATED_NEW_USER: (state , { newUser}) => {
        state.user = newUser;

    },

    SET_AUTHENTICATED_NEW_USER: (state , { newUser}) => {
        state.user = newUser;

    },

    SET_AUTHENTICATED_PROFILE_PIC: (state , { userId, profilePic}) => {

        if (state.user.id||'' === userId){
            state.user.profilePic = profilePic;
        }
    },

    SET_USER_LOGOUT: ( state, {  }) => {
        console.log('==== SET_USER_LOGOUT');
        state.sessionId = '';
        state.user =  new User({});
        state.error = '';

    },


}
