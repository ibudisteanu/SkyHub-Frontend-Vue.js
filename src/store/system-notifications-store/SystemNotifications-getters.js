/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/24/2017.
 * (C) BIT TECHNOLOGIES
 */


export default{

    areNotificationsGranted (){

        if (typeof window === "undefined")  {
            console.log("The Notifications must be in the browser");//it must be in the browser
            return false;
        }

        if (!("Notification" in window)) {
            console.log("This browser does not support system notifications");
            return false;
        }

        return Notification.permission === "granted";
    },

    areAvailable(){
        if (typeof window === "undefined")  {
            console.log("The Notifications must be in the browser");//it must be in the browser
            return false;
        }

        if (!("Notification" in window)) {
            console.log("This browser does not support system notifications");
            return false;
        }

        return true;
    },



}