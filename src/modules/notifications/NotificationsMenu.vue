<template>
  <li key="notificationMenu" class="dropdown">

    <a class="dropdown-toggle count-info" data-toggle="dropdown" href="#">
      <i class="fa fa-envelope"></i>  <span class="label label-warning">16</span>
    </a>
    <ul class="dropdown-menu dropdown-messages">

      <div is="NotificationItem"
           v-for="notification in notifications"
           v-bind:notification="notification"
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

      data: () => ({

          notification1: new Notification({
              body: '3323',
              destinationId: '2145',
              senderId: '4151251',
              description: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum ',
              id: '425151',
              dtCreation: '23/jan/1987',
              template: '',
              title: 'so such a lovly twist'
          }),
          notification2: new Notification({
              body: '3323',
              destinationId: '2145',
              senderId: '4151251',
              description: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum ',
              id: '425151ssss',
              dtCreation: '23/jan/1987',
              template: '',
              title: 'so such a lovly twist'
          }),

          notifications: [this.notification1,this.notification2],
      }),

  }
</script>
