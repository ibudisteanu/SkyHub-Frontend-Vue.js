/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/21/2017.
 * (C) BIT TECHNOLOGIES
 */

/*
    NOTIFICATION SERVICE is based on https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API

    TO DO https://stackoverflow.com/questions/27221203/send-desktop-notifications-in-chrome-or-firefox-from-a-closed-web-app
 */

class NotificationServiceClass {

  contentState = null; //from redux store
  dispatch = null;
  bStarted = false;

  constructor(props){

    console.log("@@@@ Notification Service - CREATE instance");

  }

  permissionAlreadyGranted(){
    if (typeof window === "undefined") return ; //it must be in the browser

    if (!("Notification" in window)) {
      console.log("This browser does not support system notifications");
      return false;
    }

    return Notification.permission === "granted";
  }

  askForPermissions(){
    if (typeof window === "undefined") return ; //it must be in the browser

    if (!("Notification" in window)) {
      console.log("This browser does not support system notifications");
      return;
    }

    Notification.requestPermission().then(function(result) {
      console.log("NOTIFICATION PERMISSION",result);
    });

  }


  spawnNotification(title, body, icon){

    if (typeof window === "undefined") return ; //it must be in the browser

    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      console.log("This browser does not support system notifications");
      return;
    }

    var options = {
      body: body,
      icon: icon
    }


    if (Notification.permission === "granted") {                              // Let's check whether notification permissions have already been granted
                                                                              // If it's okay let's create a notification
      var notification = new Notification(title, options);
    }
    else if (Notification.permission !== 'denied') {                          // Otherwise, we need to ask the user for permission
      Notification.requestPermission(function (permission) {
                                                                              // If the user accepts, let's create a notification
        if (permission === "granted") {
          var notification = new Notification(title, options);
        }
      });
    }

    // Finally, if the user has denied notifications and you
    // want to be respectful there is no need to bother them any more.
  }

}

var NotificationServiceInstance = new NotificationServiceClass();

export default NotificationServiceInstance;
