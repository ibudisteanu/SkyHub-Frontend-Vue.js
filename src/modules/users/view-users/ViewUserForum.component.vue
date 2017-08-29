/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/10/2017.
 * (C) BIT TECHNOLOGIES
 */


<template>

    <div>
        <slot name="view-user-top" />

        <img :src="this.getUserProfilePic" class="img-circle" align="left" alt="image" style='max-width: 48px; max-height: 48px; margin-right: 10px' />

        <slot name="view-user-after-profile-pic" />

        <h4 class="reply-header-authorName">{{ this.getUserFullName }} </h4>
        <h5 class="reply-header-bio">{{ this.getUserBio }} </h5>

        <slot name="view-user-bottom" />
    </div>

</template>


<script>

    import User from 'models/User/User.model';

    export default{

        name: 'ViewUserForum',

        props:{
            authorId: {default: ''},
            additionalInformation: {default: ''},
        },

        mounted(){
             this.$store.dispatch('CONTENT_USERS_GET', {userId: this.authorId});
        },

        computed:{
            user(){
                return this.$store.state.content.contentUsers.users[this.authorId];
            },

            getUserFullName(){
                if ((this.additionalInformation.orgName||'') !== '') return this.additionalInformation.orgName;

                return typeof this.user !== 'undefined' ? User.getName(this.user) :  this.authorId;
            },

            getUserBio(){
                if ((this.additionalInformation.orgName||'') !== '') return this.additionalInformation.orgBio||'';

                return typeof this.user !== 'undefined' ? this.user.shortBio :  'bio';
            },

            getUserProfilePic(){
                if ((this.additionalInformation.orgName||'') !== '') return this.additionalInformation.orgAvatar||'';

                return typeof this.user !== 'undefined' ? this.user.profilePic : 'https://forums.carm.org/vb5/core/images/default/default_avatar_medium.png';
            }
        }



    }

</script>