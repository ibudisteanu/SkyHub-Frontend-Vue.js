/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/23/2017.
 * (C) BIT TECHNOLOGIES
 */

import {
    fetchUser,
    fetchItems,
    fetchIdsByType
} from '../../../services/hackernews-api/index'

export default {

    SOCKET_CONNECTING_ERROR: async ({ commit } , {error}) => {

        commit('SET_SOCKET_STATUS', { connectionOffline: true,  showOnlineStatus: false,
                                      message: 'Error Connecting to the SkyHub Server. Check your internet connection or contact us at contact@skyhub.me',  icon: 'fa fa-warning' });
    },

    SOCKET_DISCONNECTED: async ({ commit } ) => {

        commit('SET_SOCKET_STATUS', { connectionOffline: true,  showOnlineStatus: false,  message: 'Connection Problem',  icon: 'fa fa-warning', });
    },

    SOCKET_CONNECTION_SUCCESSFULLY: async ({ commit, dispatch } ) => {

        commit('SET_SOCKET_STATUS', { connectionOffline: false, showOnlineStatus: true, message: 'Connection established to SkyHub',  icon: 'fa fa-check', });

        setTimeout(() => {
            dispatch('SOCKET_HIDE_STATUS_MESSAGE', {})
        } , 3000);

    },

    SOCKET_HIDE_STATUS_MESSAGE: async ({ commit, dispatch } ) => {

        commit('SET_SOCKET_STATUS', { connectionOffline: false, showOnlineStatus: false, message: '', icon: '' });

    }


}

