/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/26/2017.
 * (C) BIT TECHNOLOGIES
 */

export default{
    // items that should be currently displayed.
    // this Array may not be fully fetched.
    getForums (state, getters) {
        return Object.keys(state.forums).map(function(key){return state.forums[key]});
    }
}