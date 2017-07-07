/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */


import actions from './ContentForums-actions'
import mutations from './ContentForums-mutations'
import getters from './ContentForums-getters'

export default {

    state:{

        forums: {/* [id: number]: Item */},

        pageIndex : 0,
        pageCount : 0,
        hasNext: true,
    },


    actions,
    getters,
    mutations,
}

