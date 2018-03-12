/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/6/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService'
import Vue from 'vue';

export default{

    CONTENT_USERS_GET: async ({commit, state, dispatch}, {userId}) =>{

        try {

            if ((userId === '')||(typeof userId === 'undefined')) return {result: false };

            if (typeof state.users[userId] !== 'undefined'){ //already fetched before
                return {result:true, user: state.users[userId], message:'Already Fetched before'};
            }

            if (typeof state.loading[userId] !== 'undefined'){
                return {result:true, message:'It is loading...'}
            }

            console.log('get-user', '#'+userId+'#');

            commit('SET_CONTENT_USER_AS_LOADING',{userId: userId, status: true});
            let resData =  await FetchService.sendRequestWaitOnce("users/get-user", {userId: userId }, userId);

            console.log('get-user answer', resData);

            if (resData.result){
                await commit('SET_CONTENT_USER',{user: resData.user});
            }

            return resData;

        }
        catch (Exception){
            console.log("Exception getting the user ",Exception.toString());
        }

    },

    CONTENT_USERS_CHANGE_PROFILE_PIC: async ({commit, state, dispatch}, {userId, profilePic}) => {

        try {

            if ((userId === '')||(typeof userId === 'undefined')) return {result: false };

            console.log('CONTENT_USERS_CHANGE_PROFILE_PIC 1',userId, profilePic);

            let resData =  await FetchService.sendRequestWaitOnce("users/set-profile-pic", {userId: userId, profilePic: profilePic }, userId);

            console.log('CONTENT_USERS_CHANGE_PROFILE_PIC',resData);

            if (resData.result){
                await commit('SET_CONTENT_USER_PROFILE_PIC',{userId: userId, profilePic: profilePic});
                await commit('SET_AUTHENTICATED_PROFILE_PIC',{userId: userId, profilePic: profilePic});
            }

        } catch (Exception){
            console.log("Exception getting the user ",Exception.toString());
        }
    }

}