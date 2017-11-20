/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/6/2017.
 * (C) BIT TECHNOLOGIES
 */

import UserProperties from 'models/User/User.properties.js';
import User from 'models/User/User.model.js';

export default{

    getUsers (state, getters) {
        let result = Object.keys(state.users).map(function(key){return state.users[key]});

        return result;
    },


    getUser : (state => (userId)=>{

        if (typeof userId === 'object'){
            return userId;
            //not working...
            // if (userId !== null && userId instanceof User) return userId;
            // else return null;
        }

        if ((typeof userId === 'string')&&(typeof state.users[userId] !== 'undefined'))
            return state.users[userId];

        return null;
    }),


    getUserFullName: ((state, getters) => (userId) => {

        let user = getters.getUser(userId);
        if (user === null) return '';

        return user.firstName + ' ' + user.lastName;
    }),

    isUserLoggedIn: ((state, getters) => (userId) => {

        let user = getters.getUser(userId);
        if (user === null) return false;

        return user.loggedIn || false;
    }),

    isUserAdmin: ((state, getters) => (userId) => {

        let user = getters.getUser(userId);
        if (user === null) return false;

        return UserProperties.isAdmin(user.role);

    }),

    getUserProfilePic: ((state, getters) => (userId)=>{

        let user = getters.getUser(userId);
        if (user === null) return '';

        return user.profilePic||'';

    }),

}