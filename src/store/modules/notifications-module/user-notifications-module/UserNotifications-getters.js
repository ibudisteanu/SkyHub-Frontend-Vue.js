/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/3/2017.
 * (C) BIT TECHNOLOGIES
 */

export default{
    // items that should be currently displayed.
    // this Array may not be fully fetched.


    getNotifications (state, getters) {
        let result = Object.keys(state.notifications).map(function(key){return state.notifications[key]});

        result.sort(function(a,b) {return (a.dtCreation > b.dtCreation) ? -1 : ((b.dtCreation > a.dtCreation) ? 1 : 0);} );

        return result;
    }
}