/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/23/2017.
 * (C) BIT TECHNOLOGIES
 */

import Vuex from 'vuex'

import actions from './authenticate-actions'
import mutations from './authenticate-mutations'
import getters from './authenticate-getters'

export default {
    state:  {
        authenticatedUser: null,
    },
    actions,
    mutations,
    getters
}
