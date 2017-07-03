/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/3/2017.
 * (C) BIT TECHNOLOGIES
 */

export default{
    // items that should be currently displayed.
    // this Array may not be fully fetched.
    getNotifications (state, getters) {
        return Object.keys(state.notifications).map(function(key){return state.notifications[key]});
    }
}