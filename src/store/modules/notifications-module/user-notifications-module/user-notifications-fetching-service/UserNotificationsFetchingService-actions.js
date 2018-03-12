/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/3/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService'
import Notification from 'models/Notification/Notification.model';

export default{

    USER_NOTIFICATIONS_FETCHING_SERVICE_START: async ({ commit, state, dispatch } , {}) => {

        if (state.serviceStarted === true){
            return false; //the service has been already started
        }

        console.log('#### USER_NOTIFICATIONS_FETCHING_SERVICE_START ');
        state.serviceStarted=true;
        dispatch('USER_NOTIFICATIONS_FETCHING_SERVICE_EXECUTE', {});

    },

    USER_NOTIFICATIONS_FETCHING_SERVICE_EXECUTE: async ({commit, state, rootState, dispatch}, {}) => {

        //console.log('#### USER_NOTIFICATIONS_FETCHING_SERVICE_EXECUTE ');
        if (state.serviceStarted === false){
            return false; //the service has been finished
        }

        let resData = await FetchService.sendRequestWaitOnce("notifications/get-last-notifications", {});

        if (resData.result){
            //console.log('#### USER_NOTIFICATIONS_FETCHING_SERVICE_EXECUTE ANSWER', resData);

            commit('SET_USER_NOTIFICATIONS_UNREAD_COUNT', {unreadNotifications: parseInt(resData.unreadNotifications)});

            for (let i=0; i<resData.notifications.length; i++){
                if (typeof rootState.notifications.user.notifications[resData.notifications[i].id] === 'undefined') { //it is a new notification

                    let notification = new Notification(resData.notifications[i]);

                    let usersInvolved = notification.getUsersInvolved();
                    for (let i=0; i<usersInvolved.length; i++){
                        await dispatch('CONTENT_USERS_GET', {userId: usersInvolved[i]});
                    }


                    commit('SET_USER_NOTIFICATION',{notification: notification});

                    if (notification.shown === false)
                        dispatch('SYSTEM_NOTIFICATIONS_SPAWN_NOTIFICATION',{notification: notification});

                }

            }
        }


        setTimeout(function(){
            dispatch('USER_NOTIFICATIONS_FETCHING_SERVICE_EXECUTE',{});
        }.bind(this), 5000);
    },

    USER_NOTIFICATIONS_FETCHING_SERVICE_STOP: async ({ commit, state } , {}) => {

        this.state.serviceStarted = false;

    },

    USER_NOTIFICATIONS_FETCHING_SERVICE_ENABLE: async ({state, dispatch}, {enable})=>{

        console.log('USER_NOTIFICATIONS_FETCHING_SERVICE_ENABLE');

        if (enable === true) dispatch('USER_NOTIFICATIONS_FETCHING_SERVICE_START');
        else dispatch('USER_NOTIFICATIONS_FETCHING_SERVICE_STOP');

    },

}