/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/23/2017.
 * (C) BIT TECHNOLOGIES
 */

import Vuex from 'vuex'

import actions from './Hackernews-actions'
import mutations from './Hackernews-mutations'
import getters from './Hackernews-getters'

export default {
    state:  {
        activeType: null,
        itemsPerPage: 20,
        items: {/* [id: number]: Item */},
        users: {/* [id: string]: User */},
        lists: {
            top: [/* number */],
            new: [],
            show: [],
            ask: [],
            job: []
        }
    },
    actions,
    mutations,
    getters
}
