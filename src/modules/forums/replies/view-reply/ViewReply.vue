/**
* Created by BIT TECHNOLOGIES on 5/28/2017.
*/

/*
PreviewForum can also work with a prop id="1_frm_3333", and it fetch automatically the forum from you
*/

<template>

    <div class="media reply-form" style="background-color:white; ">

        <div class="row form-head-line">
            <Voting :parentId = "reply.id" />

            <img :src="this.getUserProfilePic" class="img-circle" align="left" alt="image" style='max-width: 48px; max-height: 48px; margin-right: 10px' />

            <div>
                <ShowDate className="date information" style="float:right; margin-right: 10px" :date="reply.dtCreation" />
            </div>

            <div>
                <h3 class="reply-header-title">{{reply.title || ' ' }} </h3>

                <h4 class="reply-header-authorName">{{ this.getUserFullName }} </h4>
                <h5 class="reply-header-bio">{{ this.getUserBio }} </h5>
            </div>

        </div>

        <div class="media-body reply-form-content">

            <p>
                <div v-html="reply.description" />
            </p>

        </div>

        <div class="reply-form-footer">

            <div v-if="(Array.isArray(reply.attachments))&&(reply.attachments.length > 0)">
                <DisplayAttachments :attachments="reply.attachments||[]" />
            </div>

            <div class="reply-form-footer-buttons">
                <ContentButtonsInline  buttonsRowStyle="paddingBottom: 10px" :parentId="reply.parentId" parentName="" :parentReplyId="reply.id" :parentReplyName="reply.title"/>
            </div>

            <div  class="reply-form-footer-subReplies" style="padding-right: 10px">

                <ViewAllReplies
                        :key="'ViewReplies_'+reply.id"
                        :parentReplyId = "reply.id"
                        :parentId = "parentId"
                />


            </div>
        </div>

    </div>


</template>


<script>

    import Reply from "models/Reply/Reply.model";
    import ViewAllReplies from "./ViewAllReplies.vue";
    import ShowDate from 'client/components/util-components/UI/show-date/ShowDate.component.vue';
    import Voting from  'modules/forums/voting/Voting.component.vue'
    import DisplayAttachments from 'modules/attachments/view-attachments/DisplayAttachments.vue'
    import User from 'models/User/User.model';

    import ContentButtonsInline from 'modules/forums/components/ContentButtonsInline.component.vue';

    export default {

        name: 'ViewReply',

        components: {
            'ViewAllReplies': ViewAllReplies,
            'Voting': Voting,
            'DisplayAttachments': DisplayAttachments,
            'ContentButtonsInline': ContentButtonsInline,
            'ShowDate': ShowDate,
        },

        beforeCreate: function () {

            if ((typeof this !== 'undefined') && (typeof this.$options !== 'undefined'))
                this.$options.components.ViewAllReplies = require('./ViewAllReplies.vue')
        },


        props: {
            reply: {default: null},

            //repliesList: { default: function () { return [] } },

            parentReplyId: {default: null},
            parentId: {default: null},

        },

        mounted: function () {
            this.$store.dispatch('CONTENT_USERS_GET', {userId: this.reply.authorId})
        },

        data: function () {
            return {}
        },

        computed: {

            user() {
                return this.$store.state.content.contentUsers.users[this.reply.authorId];
            },

            getUserFullName(){
                return typeof this.user !== 'undefined' ? User.getName(this.user) :  this.reply.authorId;
            },

            getUserBio(){
                return typeof this.user !== 'undefined' ? this.user.shortBio :  'bio';
            },

            getUserProfilePic(){
                return typeof this.user !== 'undefined' ? this.user.profilePic : 'https://forums.carm.org/vb5/core/images/default/default_avatar_medium.png';
            }
        },


    }
</script>
