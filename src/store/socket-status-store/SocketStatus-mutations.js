/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/23/2017.
 * (C) BIT TECHNOLOGIES
 */

import Vue from 'vue'

export default {

    SET_SOCKET_STATUS: (state, { sessionId }) => {
        state.connectionOffline: action.payload.connectionOffline;
        state.message: action.payload.message;
        state.icon: action.payload.icon;
        state.showOnlineStatus: action.payload.showOnlineStatus;
    },

    SET_AUTHENTICATED_NEW_USER: (state, { newUserData }) => {
        state.sessionId = sessionId
    },

}
