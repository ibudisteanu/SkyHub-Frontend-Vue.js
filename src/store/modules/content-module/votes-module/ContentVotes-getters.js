/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/1/2017.
 * (C) BIT TECHNOLOGIES
 */

export default{
    // items that should be currently displayed.
    // this Array may not be fully fetched.
    getVotes (state, getters) {
        return Object.keys(state.votes).map(function(key){return state.votes[key]});
    }


}