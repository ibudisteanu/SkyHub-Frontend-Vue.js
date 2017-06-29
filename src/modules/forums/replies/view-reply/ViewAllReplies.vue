/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/21/2017.
 * (C) BIT TECHNOLOGIES
 */



/*
 PreviewTopic can also work with a prop id="1_frm_3333", and it fetch automatically the forum from you
 */


<template>
    <div>
       <ViewReply
              v-for="(reply, index) in getChildReplies"
              :reply="reply"
              :key="reply.id"

              v-if= "reply.replyParentId == parentReplyId"
              :repliesList = "repliesList"
      >

      </ViewReply>
    </div>

</template>

<script>

    import ViewReply from './ViewReply.vue';


    export default {

        name: 'ViewAllReplies',

        components: {
            "ViewReply": ViewReply,
        },

        props:{

            repliesList: {default: function (){return []}},
            parentReplyId :{default:1},
        },

        computed:{

            getChildReplies(){
                let result = [];

                for (let i=0; i<this.repliesList.length; i++)
                    if (this.repliesList[i].replyParentId == this.parentReplyId)
                    result.push(this.repliesList[i]);

                return result;
            },

        },

        data: function () {
            return {

            }
        }
    }
</script>
