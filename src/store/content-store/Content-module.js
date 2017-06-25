/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */


import Vuex from 'vuex'

import actions from './SystemNotifications-actions'
import mutations from './SystemNotifications-mutations'
import getters from './SystemNotifications-getters'

export default {
    modules: {

    },
    state:  {
        currentRouterObject: false,
    },
    actions,
    mutations,
    getters
}

