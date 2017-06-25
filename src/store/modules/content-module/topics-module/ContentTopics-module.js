/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */


import actions from './ContentTOpics-actions'
import mutations from './ContentTopics-mutations'

export default {

    state:{

        topics: {/* [id: number]: Item */},

        pageIndex : 0,
        pageCount : 0,
    },


    actions,
    mutations,
}

