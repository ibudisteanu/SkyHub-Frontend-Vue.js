/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/23/2017.
 * (C) BIT TECHNOLOGIES
 */

import User from 'models/User/User.model'

export default {

    isAuthenticatedUserLoggedIn (state, getters) {

        return getters.isUserLoggedIn(state.user);

    },

    getAuthenticatedUserFullName (state, getters) {

        return getters.getUserFullName(state.user);

    },

    getAuthenticatedUserProfilePic (state, getters) {

        return getters.getUserProfilePic(state.user);

    },

}

