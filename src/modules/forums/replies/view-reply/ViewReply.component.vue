/**
* Created by BIT TECHNOLOGIES on 5/28/2017.
*/

/*
PreviewForum can also work with a prop id="1_frm_3333", and it fetch automatically the forum from you
*/

<template>

    <div class="media">

        <div class="forum-avatar"  >
            <Voting :voteId = "reply.votingId"
            >
            </Voting>
            <img :src="reply.authorId" class="img-circle" alt="image"/>
            <div class="author-info">
                <strong>Posts:</strong> 542<br/>
                <strong>Joined:</strong> April 11.2015<br/>
            </div>
        </div>

        <div class="media-body">
            <h4 class="media-heading">{{reply.title || '' }} </h4>
            <div v-if="reply.authorId !== ''"> {{reply.authorId}} , {{reply.authorId}}</div>
            )
        </div>

        <p> {{reply.description}}</p>

        <div style="padding-right: 10px">

            <ViewAllReplies
                    :key="'ViewReplies_'+reply.id"
                    :parentReplyId = "reply.id"
                    :repliesList="repliesList"
             />


        </div>
    </div>


</template>


<script>

    import Reply from "models/Reply/Reply.model";
    import ViewAllReplies from "./ViewAllReplies.component.vue";
    import Voting from  'modules/forums/voting/Voting.component.vue'

    export default {

        name: 'ViewReply',

        components:{
            'ViewAllReplies': ViewAllReplies,
            'Voting' : Voting
        },

        beforeCreate: function () {
            this.$options.components.ViewAllReplies = require('./ViewAllReplies.component.vue')
        },





        props: {
            reply: {default: null},
            repliesList: {
                default: function () {
                    return []
                }
            },

        },

        data: function () {
            return {}
        }


    }
</script>

