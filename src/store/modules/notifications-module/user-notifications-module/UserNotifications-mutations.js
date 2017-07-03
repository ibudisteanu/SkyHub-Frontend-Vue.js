/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/3/2017.
 * (C) BIT TECHNOLOGIES
 */

export default{

    SET_USER_NOTIFICATION: (state, { notification } ) => {

        Vue.set(state.notifications, notification.id, notification);

    },

    SET_USER_NOTIFICATION_AS_SHOWN: (state, { notificationId, shown } ) => {

        state.notifications[notificationId.id].shown = shown;
        //Vue.set(state.notifications, notification.id, notification);

    },

    SET_USER_NOTIFICATIONS_UNREAD_COUNT: (state, { unreadNotifications } ) => {

        state.unreadNotifications = unreadNotifications;

    }

}