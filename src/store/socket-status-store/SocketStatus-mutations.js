/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/23/2017.
 * (C) BIT TECHNOLOGIES
 */

import Vue from 'vue'

export default {

    SET_SOCKET_STATUS: (state, { connectionOffline, message, icon, showOnlineStatus} ) => {
        state.connectionOffline = connectionOffline;
        state.message = message;
        state.icon = icon;
        state.showOnlineStatus = showOnlineStatus;
    },

}
