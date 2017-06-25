/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/24/2017.
 * (C) BIT TECHNOLOGIES
 */

export default{

    SYSTEM_NOTIFICATIONS_ASK_PERMISSION: ({ commit, dispatch, state, getters }, {  }) => {

        if (!getters.areAvailable) return false;

        return Notification.requestPermission().then(function(result) {
            console.log("NOTIFICATION PERMISSION REQUEST",result);

            dispatch('SYSTEM_NOTIFICATIONS_CHECK_PERMISSION',{});
        });

    },

    SYSTEM_NOTIFICATIONS_CHECK_PERMISSION: ({ commit, dispatch, state, getters }, {  }) => {

        if (!getters.areAvailable) return false;


        console.log("checking for notifications permissions", {permission: getters.areNotificationsGranted});
        commit('SET_SYSTEM_NOTIFICATIONS_PERMISSION_STATE',{permission: getters.areNotificationsGranted});

    },

    SYSTEM_NOTIFICATIONS_SPAWN: async ( {commit, dispatch, state, getters}, {title, body, icon}) => {

        if (!getters.areAvailable)
            return false;

        var options = {
            body: body,
            icon: icon
        }

        if (Notification.permission === "granted") {                              // Let's check whether notification permissions have already been granted

            var notification = new Notification(title, options);
        }

        else if (Notification.permission !== 'denied') {                          // Otherwise, we need to ask the user for permission
            Notification.requestPermission(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    var notification = new Notification(title, options);
                }
            });
        }


    }
}