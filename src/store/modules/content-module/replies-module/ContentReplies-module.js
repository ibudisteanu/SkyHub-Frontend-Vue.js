/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/29/2017.
 * (C) BIT TECHNOLOGIES
 */


import actions from './ContentReplies-actions'
import mutations from './ContentReplies-mutations'
import getters from './ContentReplies-getters'

export default {

    state:{

        replies: {/* [id: number]: Item */},

        pageIndex : 0,
        pageCount : 0,
    },


    actions,
    getters,
    mutations,
}

