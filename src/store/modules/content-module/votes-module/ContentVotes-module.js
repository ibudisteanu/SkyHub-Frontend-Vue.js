/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/1/2017.
 * (C) BIT TECHNOLOGIES
 */

import actions from './ContentVotes-actions'
import getters from './ContentVotes-getters'
import mutations from './ContentVotes-mutations'

export default {

    state:{

        votes: { /* [id: number]: Item */},

    },


    actions,
    getters,
    mutations,

}