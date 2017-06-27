/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/27/2017.
 * (C) BIT TECHNOLOGIES
 */

export default{
    // items that should be currently displayed.
    // this Array may not be fully fetched.
    getTopics (state, getters) {
        return Object.keys(state.topics).map(function(key){return state.topics[key]});
    }
}