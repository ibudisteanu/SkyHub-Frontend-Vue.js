/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/3/2017.
 * (C) BIT TECHNOLOGIES
 */

import Vuex from 'vuex'

import UserNotificationsFetchingServiceModule from './user-notifications-fetching-service/UserNotificationsFetchingService-module';
import actions from './UserNotifications-actions'
import mutations from './UserNotifications-mutations'
import getters from './UserNotifications-getters'

export default {

    modules:{
        fetchingService: UserNotificationsFetchingServiceModule,
    },

    state:  {
        notifications: {/* [id: number]: Item */},

        unreadNotifications: 0,

        pageIndex : 1,
        pageCount : 8,
    },
    actions,
    mutations,
    getters
}
