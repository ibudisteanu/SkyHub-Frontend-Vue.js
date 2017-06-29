/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/29/2017.
 * (C) BIT TECHNOLOGIES
 */


export default{
    // items that should be currently displayed.
    // this Array may not be fully fetched.
    getReplies (state, getters) {
        return Object.keys(state.replies).map(function(key){return state.replies[key]});
    }
}