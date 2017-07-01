/**
* Created by BIT TECHNOLOGIES on 5/28/2017.
*/

/*
PreviewForum can also work with a prop id="1_frm_3333", and it fetch automatically the forum from you
*/

<template>

    <div class="media reply-form" style="background-color:white; ">

        <div class="row form-head-line">
            <Voting :voteId = "reply.votingId" />

            <img src="https://blogcdn1.secureserver.net/wp-content/uploads/2014/06/create-a-gravatar-beard.png" class="img-circle" align="left" alt="image" style='max-width: 48px; max-height: 48px' />

            <div>
                <h3 class="reply-header-title">{{reply.title || ' ' }} </h3>

                <h4 class="reply-header-authorName">{{ reply.authorId }} </h4>
                <h5 class="reply-header-bio">{{ 'BIO' }} </h5>
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
    import Voting from  'modules/forums/voting/Voting.component.vue'
    import DisplayAttachments from 'modules/attachments/view-attachments/DisplayAttachments.vue'

    import ContentButtonsInline from 'modules/forums/components/ContentButtonsInline.component.vue';

    export default {

        name: 'ViewReply',

        components:{
            'ViewAllReplies': ViewAllReplies,
            'Voting' : Voting,
            'DisplayAttachments': DisplayAttachments,
            'ContentButtonsInline': ContentButtonsInline,
        },

        beforeCreate: function () {

            if ((typeof this !== 'undefined')&&(typeof this.$options !== 'undefined'))
                this.$options.components.ViewAllReplies = require('./ViewAllReplies.vue')
        },



        props: {
            reply: {default: null},

            //repliesList: { default: function () { return [] } },

            parentReplyId :{default: null},
            parentId : {default: null},

        },

        data: function () {
            return {}
        }


    }
</script>

