/**
 * Created by Alexandru Ionut Budisteanu
 *
 */


import Vuex from 'vuex'

import actions from './Wallet-actions'
import mutations from './Wallet-mutations'
import getters from './Wallet-getters'

export default {
    state:  {
        walletMenuStatus: false,

        walletAddresses:  { /* [id: number]: Item */},

    },
    actions,
    mutations,
    getters
}