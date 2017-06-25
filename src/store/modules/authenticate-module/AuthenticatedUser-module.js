/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/23/2017.
 * (C) BIT TECHNOLOGIES
 */

import Vuex from 'vuex'

import actions from './AuthenticatedUser-actions'
import mutations from './AuthenticatedUser-mutations'
import getters from './AuthenticatedUser-getters'

import User from 'models/User/User.model';

export default {
    state:  {
        user: new User({}),
        sessionId: '',
        error: '',
    },
    actions,
    mutations,
    getters
}
