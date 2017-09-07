/**
* Created by Alexandru Ionut Budisteanu - SkyHub on 6/24/2017.
* (C) BIT TECHNOLOGIES
*/


<template>
    <div v-if="this.notification !== null" :style="!notification.read ? 'background-color: #edf2fa' : '' ">

         <li style="min-height: 32px">
               <div class="dropdown-messages-box" @click="this.markNotificationAsRead">

                   <router-link :to="'/'+notification.params.anchor||''" style="display:block">
                       <div style="margin-left: -15px;">
                            <img :alt="this.notificationTitle" class="img-circle" :src="this.notificationLeftImage"  align="left"  />
                       </div>
                   </router-link>

                   <router-link :to="'/'+notification.params.anchor||''" style="display:block">
                        <div class="media-body" style="min-height: 50px; padding-left: 10px">

                             <small class="pull-right">
                                 <ShowDate :date="notification.dtCreation" />
                             </small>

                             <div v-if="this.notificationTitle !== ''">
                                <strong>{{this.notificationTitle}}</strong>
                                 <br/>
                             </div>

                            <small class="text-muted" v-html="this.notificationBody">
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
    import ContentObjectService from 'store/helpers/ContentObject.service';

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


            notificationTitle(){
                return this.$store.getters.getNotificationTitle(this.notification);
            },

            notificationBody(){
                return this.$store.getters.getNotificationBody(this.notification);
            },

            notificationLeftImage(){
                return this.$store.getters.getNotificationLeftImage(this.notification);
            },

            notificationRightImage(){
                return this.$store.getters.getNotificationRightImage(this.notification);
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
