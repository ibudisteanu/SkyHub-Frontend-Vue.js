/**
 * Created by Alexandru Ionut Budisteanu
 *
 */


import Vuex from 'vuex'

import actions from './Mining-actions'
import mutations from './Mining-mutations'

export default {
    state:  {

        startedMining: false,

    },
    actions,
    mutations,
}