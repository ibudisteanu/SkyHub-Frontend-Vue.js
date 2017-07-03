/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/3/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService';

export default{

    USER_NOTIFICATIONS_MARK_READ: async ({state, commit}, {notificationId, read, all})=> {


        FetchService.sendRequestGetData('notifications/mark-notification-shown', {notificationId: notificationId});

    },

    USER_NOTIFICATIONS_MARK_SHOWN: async ({state, commit}, {notificationId})=> {

        //console.log('##############, USER_NOTIFICATION_NOTIFICATION_SHOWN', notificationId);

        FetchService.sendRequestGetData('notifications/mark-notification-shown', {notificationId: notificationId});
        commit('SET_USER_NOTIFICATION_AS_SHOWN', {notificationId: notificationId, shown: true});

    }

}