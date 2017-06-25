/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */


import actions from './ContentForums-actions'
import mutations from './ContentForums-mutations'

export default {

    state:{

        forums: {/* [id: number]: Item */},

        pageIndex : 0,
        pageCount : 0,
    },


    actions,
    mutations,
}

