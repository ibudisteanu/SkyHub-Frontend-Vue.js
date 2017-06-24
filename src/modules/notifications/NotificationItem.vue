/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/24/2017.
 * (C) BIT TECHNOLOGIES
 */


<template>
 <div>
  <li key={notification.id}>
   <div class="dropdown-messages-box">
    <a href="profile.html" class="pull-left">
     <img alt="image" class="img-circle" src="http://webapplayers.com/inspinia_admin-v2.7.1/img/a7.jpg" />
    </a>
    <div>

     <small class="pull-right">46h ago</small>
     <strong>dddd
     </strong> started following <strong>{notification.destinationId}</strong>. <br/>
     <small class="text-muted">{notification.dtCreation}</small>
    </div>
   </div>
  </li>
  <li class="divider"></li>
 </div>
</template>

<script>
 export default{
     name: 'NotificationItem',

     props: ['notification'],

 }
</script>