<template>
  <li key="notificationMenu" class="dropdown">

    <a class="dropdown-toggle count-info" data-toggle="dropdown" href="#">
        <i class="fa fa-bell"></i>
        <span v-if="unreadUserNotifications > 0" class="label label-warning">{{unreadUserNotifications}}</span>
    </a>
    <ul class="dropdown-menu dropdown-messages">

      <NotificationItem
           v-for="(notification, index) in notifications"
           :notification="notification"
           :key="notification.id"
      />

    </ul>
  </li>
</template>

<script>

  import Notification from 'models/Notification/Notification.model';
  import NotificationItem from './NotificationItem.vue';

  export default {
      name: 'NotificationsMenu',

      components: {NotificationItem},

      data: function (){

          let notification1 = new Notification({
              body: '3323',
              destinationId: '2145',
              senderId: '4151251',
              description: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum ',
              id: '425151',
              dtCreation: '23/jan/1987',
              template: '',
              title: 'so such a lovly twist'
          });
          let notification2 =  new Notification({
              body: '3323',
              destinationId: '2145',
              senderId: '4151251',
              description: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum ',
              id: '425151ssss',
              dtCreation: '23/jan/1987',
              template: '',
              title: 'so such a lovly twist'
          });

          return {notifications: [notification1,notification2]}
      },

      computed: {
          unreadUserNotifications(){
              return this.$store.state.notifications.user.unreadNotifications;
          }
      }

  }
</script>
