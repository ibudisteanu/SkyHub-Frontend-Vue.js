/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/3/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService'

export default{

    USER_NOTIFICATIONS_FETCHING_SERVICE_START: async ({ commit, state, dispatch } , {}) => {

        if (state.fetchingServiceInterval !== null){
            return false; //the service has been already started
        }

        console.log('#### USER_NOTIFICATIONS_FETCHING_SERVICE_START ');
        dispatch('USER_NOTIFICATIONS_FETCHING_SERVICE_EXECUTE', {});

        // state.fetchingServiceInterval = setInterval(function(){
        //
        //     FetchService
        //
        // }.bind(this), 5000);

    },

    USER_NOTIFICATIONS_FETCHING_SERVICE_EXECUTE: async ({commit, state, dispatch}, {}) => {

        console.log('#### USER_NOTIFICATIONS_FETCHING_SERVICE_EXECUTE ');

        let resData = await FetchService.sendRequestGetData("notifications/get-notifications", {pageIndex: 1, pageCount: 8});

        setTimeout(function(){
            dispatch('USER_NOTIFICATIONS_FETCHING_SERVICE_EXECUTE',{});
        }.bind(this), 5000);
    },

    USER_NOTIFICATIONS_FETCHING_SERVICE_STOP: async ({ commit, state } , {}) => {

        if (state.fetchingServiceInterval === null) return false;

        clearInterval(this.state.fetchingServiceInterval);

        this.state.fetchingServiceInterval = null;

    },

}