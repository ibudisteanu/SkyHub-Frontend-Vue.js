/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/23/2017.
 * (C) BIT TECHNOLOGIES
 */

import Vue from 'vue'

export default {

    SET_AUTHENTICATED_USER_SESSION: (state, { sessionId }) => {
        state.sessionId = sessionId

        for (let i=0; i<1000; i++)
            console.log("AUTHENTICATE_USER",sessionId);

    },

    SET_AUTHENTICATED_NEW_USER: (state, { newUserData }) => {
        state.sessionId = sessionId
    },

}
