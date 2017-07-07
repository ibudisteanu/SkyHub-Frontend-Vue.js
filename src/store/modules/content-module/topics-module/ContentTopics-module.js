/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */


import actions from './ContentTopics-actions'
import getters from './ContentTopics-getters'
import mutations from './ContentTopics-mutations'

export default {

    state:{

        topics: {/* [id: number]: Item */},

        pageIndex : 0,
        pageCount : 0,
        hasNext : true,
    },


    actions,
    getters,
    mutations,

}

