/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/6/2017.
 * (C) BIT TECHNOLOGIES
 */

export default{

    getUsers (state, getters) {
        let result = Object.keys(state.users).map(function(key){return state.users[key]});

        return result;
    },


    getUser : (state => (userId)=>{

        if (typeof userId === 'object') return userId;

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

    getUserProfilePic: ((state, getters) => (userId)=>{

        let user = getters.getUser(userId);
        if (user === null) return '';

        return user.profilePic||'';

    }),

}