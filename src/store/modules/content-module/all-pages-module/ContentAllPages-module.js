/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */


import actions from './ContentAllPages-actions'
import mutations from './ContentAllPages-mutations'
import getters from './ContentAllPages-getters'

export default {

    state:{

        allPages: {/* [id: number]: Item */},

        pageIndex : 0,
        pageCount : 0,
        hasNext: true,
    },


    actions,
    getters,
    mutations,
}

