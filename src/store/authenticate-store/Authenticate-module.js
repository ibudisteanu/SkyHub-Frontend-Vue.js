/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/23/2017.
 * (C) BIT TECHNOLOGIES
 */

import Vuex from 'vuex'

import actions from './Authenticate-actions'
import mutations from './Authenticate-mutations'
import getters from './Authenticate-getters'

export default {
    state:  {
        authenticatedUser: null,
        sessionId: '',
    },
    actions,
    mutations,
    getters
}
