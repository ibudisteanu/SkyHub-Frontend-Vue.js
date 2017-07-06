/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/6/2017.
 * (C) BIT TECHNOLOGIES
 */

import actions from './ContentUsers-actions'
import getters from './ContentUsers-getters'
import mutations from './ContentUsers-mutations'

export default {

    state:{

        users: { /* [id: number]: Item */},

        loading: {},


    },


    actions,
    getters,
    mutations,

}