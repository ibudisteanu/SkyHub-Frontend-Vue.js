/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/23/2017.
 * (C) BIT TECHNOLOGIES
 */

import Vuex from 'vuex'

import actions from './SocketStatus-actions'
import mutations from './SocketStatus-mutations'
import getters from './SocketStatus-getters'

export default {
    state:  {
        connectionOffline: false,
        message : '',

        icon : '',
        showOnlineStatus : false,
    },
    actions,
    mutations,
    getters
}
