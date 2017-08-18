/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/6/2017.
 * (C) BIT TECHNOLOGIES
 */

import User from 'models/User/User.model';
import Vue from 'vue';

export default{

    SET_CONTENT_USER: (state, { user }) => {

        Vue.set(state.users, user.id, new User(user));

    },

    SET_CONTENT_USER_AS_LOADING: (state, {userId, status}) => {
    
        Vue.set(state.loading, userId, status )
    
    },

    SET_CONTENT_USER_PROFILE_PIC: (state, {userId, profilePic}) => {

        let user = state.users[userId];
        if ((typeof user !== 'undefined')&&(user !== null)){
            user.profilePic = profilePic;
            Vue.set(state.users, userId, user);
        }
    },

}