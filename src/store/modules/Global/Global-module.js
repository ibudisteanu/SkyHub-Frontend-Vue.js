/**
 * Created by Alexandru Ionut Budisteanu
 *
 */


import Vuex from 'vuex'

import actions from './Global-actions'
import mutations from './Global-mutations'

export default {
    state:  {


        screenHeight: 0,
        screenWidth:0,

        statusType: '',
        statusMessage: '',

        bountyCountDownDateFetchingNewList: 0,

    },
    actions,
    mutations,
}