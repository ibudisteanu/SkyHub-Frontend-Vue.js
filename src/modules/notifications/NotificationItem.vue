/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/24/2017.
 * (C) BIT TECHNOLOGIES
 */


<template>
     <div v-if="this.notification !== null" :style="!notification.read ? 'background-color: #edf2fa' : '' ">
          <li>
               <div class="dropdown-messages-box" @click="this.markNotificationAsRead">

                   <router-link :to="'/'+notification.params.anchor||''" style="display:block">
                       <div style="margin-left: -15px;">
                            <img alt="image" class="img-circle" :src="this.leftImage"  align="left"  />
                       </div>
                   </router-link>

                   <router-link :to="'/'+notification.params.anchor||''" style="display:block">
                        <div class="media-body" style="min-height: 50px; padding-left: 10px">
                             <small class="pull-right">
                                 <ShowDate :date="notification.dtCreation" />
                             </small>
                             <strong>{{this.title}}</strong> <br/>

                            <small class="text-muted" v-html="this.body">
                            </small>
                            <br/>

                        </div>
                   </router-link >

               </div>
          </li>
          <li class="divider" style="margin: 2px;"></li>
     </div>
</template>

<script>
    import ShowDate from 'client/components/util-components/UI/show-date/ShowDate.component.vue';
    import UserModel from 'models/User/User.model';

     export default{
         name: 'NotificationItem',

         components:{
             'ShowDate' : ShowDate,
         },

         props: {
             notification: {default:  null},
             last: {default: false},
         },

         computed:{

             title(){

                 return this.notification.params.title||'';

             },

             body(){

                 let result = '';

                 if (this.user !== null){
                     result += "<b>"+UserModel.getName(this.user)+"</b>";
                 }

                 switch (this.notification.template){
                     case 'new-reply':
                         result += " replied to your content: ";
                         break;
                     case 'new-topic':
                         result += " created a new topic: ";
                         break;
                 }

                 result += '<b>'+this.notification.params.body||''+'</b>';

                 return result;
             },

             leftImage(){
                 if (this.user !== null){
                     return this.user.profilePic;
                 }

                 return this.notification.params.icon || '/public/SkyHub-logo.png';
             },

             rightImage(){

             },


             user(){

                 if ((this.notification.params.userSourceId||'') === '')
                     return null;
                 else
                     return this.$store.state.content.contentUsers.users[(this.notification.params.userSourceId||'')]||null;
             },


         },

         methods:{
             markNotificationAsRead(){
                 console.log('markNotificationAsRead');
                 return this.$store.dispatch('USER_NOTIFICATIONS_MARK_READ', {notificationId:this.notification.id, markRead:true, markAll:false});
             },

         },

     }
</script>