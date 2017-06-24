/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/24/2017.
 * (C) BIT TECHNOLOGIES
 */

export default{
    SET_SYSTEM_NOTIFICATIONS_PERMISSION_STATE: (state, { permission }) => {
        state.notificationsPermissionGranted = permission;
    },
}