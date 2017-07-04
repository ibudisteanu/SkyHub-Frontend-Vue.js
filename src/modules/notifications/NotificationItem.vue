/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/24/2017.
 * (C) BIT TECHNOLOGIES
 */


<template>
 <div :style="!notification.read ? 'background-color: #edf2fa' : '' ">
      <li>
           <div class="dropdown-messages-box" @click="this.markNotificationAsRead">

               <router-link :to="notification.params.url||''" style="display:block">
                   <div style="margin-left: -15px;">
                        <img alt="image" class="img-circle" :src="notification.params.icon || '/public/SkyHub-logo.png'"  align="left"  />
                   </div>
               </router-link>

               <router-link :to="notification.params.url||''" style="display:block">
                    <div class="media-body" style="min-height: 50px; padding-left: 10px">
                         <small class="pull-right">
                             <ShowDate :date="notification.dtCreation" />
                         </small>
                         <strong>{{notification.params.title}}</strong> <br/>

                        <small class="text-muted">{{notification.params.body}}</small> <br/>

                    </div>
               </router-link >

           </div>
      </li>
      <li class="divider" style="margin: 2px;"></li>
 </div>
</template>

<script>
    import ShowDate from 'client/components/util-components/UI/show-date/ShowDate.component.vue';

     export default{
         name: 'NotificationItem',

         components:{
             'ShowDate' : ShowDate,
         },

         props: {
             notification: {default:  null},
             last: {default: false},
         },

         methods:{
             markNotificationAsRead(){
                 console.log('markNotificationAsRead');
                 return this.$store.dispatch('USER_NOTIFICATIONS_MARK_READ', {notificationId:this.notification.id, markRead:true, markAll:false});
             }
         },

     }
</script>