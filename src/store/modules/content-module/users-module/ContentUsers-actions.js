/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/6/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService'
import Vue from 'vue';

export default{

    CONTENT_USERS_GET: async ({commit, state, dispatch}, {userId}) =>{

        try {

            if (typeof state.users[userId] !== 'undefined'){ //already fetched before
                return {result:true, user: state.users[userId]};
            };

            if (typeof state.loading[userId] !== 'undefined') {
                console.log('@@@@@@@@@@@@@ await promise');
                return await state.loading[userId];
            }


            let resData = FetchService.sendRequestGetData("users/get-user", {userId: userId });
            Vue.set(state.loading, userId, resData);

            resData = await resData;

            if (resData.result){
                await commit('SET_CONTENT_USER',{user: resData.user});
            }

            return resData;

        }
        catch (Exception){
            console.log("Exception submitting the voting",Exception);
            throw Exception;
        }

    },

}