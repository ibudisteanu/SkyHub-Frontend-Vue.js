/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/23/2017.
 * (C) BIT TECHNOLOGIES
 */

import {
    fetchUser,
    fetchItems,
    fetchIdsByType
} from '../../services/hackernews-api/index'

export default {
    // ensure data for rendering given list type
    AUTHENTICATE_USER_BY_SESSION: ({ commit, dispatch, state }, { sessionId }) => {

        commit('SET_AUTHENTICATED_USER_SESSION', sessionId );
        // return fetchIdsByType(type)
        //     .then(ids => commit('SET_LIST', { type, ids }))
        //     .then(() => dispatch('ENSURE_ACTIVE_ITEMS'))
    },

    LOGOUT_USER: ({ commit, dispatch, state }, { }) => {
        commit('SET_AUTHENTICATED_NEW_USER', { newUserData: {} })
        commit('SET_AUTHENTICATED_USER_SESSION', { sessionId: '' })
    },

}

