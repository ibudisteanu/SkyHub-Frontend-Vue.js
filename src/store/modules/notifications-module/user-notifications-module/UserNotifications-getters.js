/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/3/2017.
 * (C) BIT TECHNOLOGIES
 */

export default{
    // items that should be currently displayed.
    // this Array may not be fully fetched.


    getNotifications (state, getters) {
        let result = Object.keys(state.notifications).map(function(key){return state.notifications[key]});

        result.sort(function(a,b) {return (a.dtCreation > b.dtCreation) ? -1 : ((b.dtCreation > a.dtCreation) ? 1 : 0);} );

        return result;
    },


    getNotification : (state => (notificationId)=>{

        if (typeof notificationId === 'object') return notificationId;

        if ((typeof notificationId ==='string')&&(typeof state.notifications[notificationId] !== 'undefined'))
            return state.notifications[notificationId];

        return null;
    }),

    getNotificationUserSource : ( (state,getters) => (notificationId) =>{

        let notification = getters.getNotification(notificationId);
        if (notification === null) return '';

        if ((notification.params.userSourceId||'') === '')
            return null;
        else
            return getters.getUser(notification.params.userSourceId);
    }),


    getNotificationBody: ((state, getters) => (notificationId) => {
        let body = '';

        let notification = getters.getNotification(notificationId);
        if (notification === null) return '';

        let user = getters.getNotificationUserSource(notification);
        if (user !== null)
            body += "<b>"+getters.getUserFullName(user)+"</b>";


        let objectType = getters.getNotificationObjectType(notification);

        switch (notification.template){
            case 'new-reply':
                body += " : ";
                break;
            case 'new-topic':
                body += " created new topic: ";
                break;
            case 'new-vote':
                body += " liked your "+objectType;
                break;
        }

        body += '<b>'+notification.params.body||''+'</b>';

        return body;
    }),

    getNotificationTitle : ( (state, getters) => (notificationId)=>{

        let notification = getters.getNotification(notificationId);
        if (notification === null) return '';

        let title = notification.params.title||'';

        if (title.length < 3)
            switch (notification.template){
                case 'new-vote':
                    title = "You got voted UP";
                    break;
                case 'new-reply':
                    title = "New Reply";
                    break;
            }

        return title;
    }),

    getNotificationLeftImage: ( (state, getters) => (notificationId) =>{

        let notification = getters.getNotification(notificationId);
        if (notification === null) return '';

        let user = getters.getNotificationUserSource(notification);
        if (user !== null)
            return getters.getUserProfilePic(user.id);

        return notification.params.icon || '/public/SkyHub-logo.png';
    }),

    getNotificationRightImage: ((state, getters)=>(notificationId)=>{

        let objectType = getters.getObjectType(notificationId);
        if (objectType !== null){

            return 'content';

        }
    }),

    getNotificationObjectType: ( (state,getters) => (notificationId)=>{

        let notification = getters.getNotification(notificationId);


        return 'content';
    }),



}