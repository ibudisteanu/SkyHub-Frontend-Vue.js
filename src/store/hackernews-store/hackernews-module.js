/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/23/2017.
 * (C) BIT TECHNOLOGIES
 */

import Vuex from 'vuex'

import actions from './hackernews-actions'
import mutations from './hackernews-mutations'
import getters from './hackernews-getters'

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
