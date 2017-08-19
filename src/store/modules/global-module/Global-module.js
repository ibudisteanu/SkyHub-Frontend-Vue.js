/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

import Vuex from 'vuex'

import actions from './Global-actions'
import mutations from './Global-mutations'
import getters from './Global-getters'

export default {
    state:  {
        refAuthenticationModal: null,
        refModal: null,
    },
    actions,
    mutations,
    getters
}
