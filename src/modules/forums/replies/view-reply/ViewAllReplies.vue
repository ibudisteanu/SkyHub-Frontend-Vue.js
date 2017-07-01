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
              :parentId = "parentId"
              :parentReplyId = "parentReplyId"
              :key="reply.id"


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
            //repliesList: {default: function (){return []}},

            parentReplyId :{default: null},
            parentId : {default: null},
        },

        computed:{

            repliesList(){
                return this.$store.getters.getReplies;
            },

            getChildReplies(){
                let result = [];

                let repliesList = this.repliesList;

                console.log("@@@@@@@@@@@ REPLIES LIST", repliesList);

                for (let i=0; i<repliesList.length; i++)
                    if ((repliesList[i] !== null)&&(repliesList[i].parentReplyId == this.parentReplyId)&&(repliesList[i].parentId == this.parentId))
                        result.push(repliesList[i]);

                return result;
            },

        },

        data: function () {
            return {

            }
        }
    }
</script>