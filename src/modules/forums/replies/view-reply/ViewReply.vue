/**
* Created by BIT TECHNOLOGIES on 5/28/2017.
*/

/*
PreviewForum can also work with a prop id="1_frm_3333", and it fetch automatically the forum from you
*/

<template>

    <div class="media reply-form" >

        <div class="row form-head-line">
            <Voting :parentId = "reply.id" :preview="this.preview" />

            <div>
                <ShowDate className="date information" style="float:right; margin-right: 10px" :date="reply.dtCreation" />
            </div>

            <ViewUserForum :authorId="this.reply.authorId">
                <h3 class="reply-header-title" slot="view-user-after-profile-pic">{{reply.title || ' ' }} </h3>
            </ViewUserForum>

        </div>

        <div class="media-body reply-form-content">

            <p>
                <div v-html="this.preview ? reply.shortDescription : reply.description" />
            </p>

        </div>

        <div class="reply-form-footer">

            <div v-if="(Array.isArray(reply.attachments))&&(reply.attachments.length > 0)">
                <DisplayAttachments :attachments="reply.attachments||[]" />
            </div>

            <div class="reply-form-footer-buttons" v-if="!this.preview">
                <ContentButtonsInline  buttonsRowStyle="paddingBottom: 10px" :parentId="reply.parentId" parentName="" :parentReplyId="reply.id" :parentReplyName="reply.title"/>
            </div>

            <div  class="reply-form-footer-subReplies">

                <ViewAllReplies
                        :key="'ViewReplies_'+reply.id"
                        :parentReplyId = "reply.id"
                        :parentId = "parentId"

                        :preview="this.preview"
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

    import ContentButtonsInline from 'modules/forums/components/ContentButtonsInline.component.vue';
    import ViewUserForum from 'modules/users/view-users/ViewUserForum.component.vue';

    export default {

        name: 'ViewReply',

        components: {
            'ViewAllReplies': ViewAllReplies,
            'Voting': Voting,
            'DisplayAttachments': DisplayAttachments,
            'ContentButtonsInline': ContentButtonsInline,
            'ShowDate': ShowDate,
            'ViewUserForum': ViewUserForum,
        },

        beforeCreate: function () {

            if ((typeof this !== 'undefined') && (typeof this.$options !== 'undefined'))
                this.$options.components.ViewAllReplies = require('./ViewAllReplies.vue')
        },


        props: {
            reply: {default: null},

            parentReplyId: {default: null},
            parentId: {default: null},
            preview : {default: false},

        },

        data: function () {
            return {}
        },

        computed: {


        },


    }
</script>
