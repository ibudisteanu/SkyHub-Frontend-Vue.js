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

<<<<<<< HEAD
    <div>

        <div v-if="reply !== null" class="media">
            <a class="forum-avatar" href="#">
                <img :src="reply.authorId" class="img-circle" alt="image"/>
                <div class="author-info">
                    <strong>Posts:</strong> 542<br/>
                    <strong>Joined:</strong> April 11.2015<br/>
                </div>
            </a>

            <div class="media-body">
                <h4 class="media-heading">{{reply.title || '' }} </h4>
                <div v-if="reply.authorId !== ''"> {{reply.authorId}} , {{reply.authorId}}</div>
                )
            </div>
            <p> {{reply.description}}</p>

         </div>

        <div style="padding-right: 20px">
            <ViewAllReply
                    v-for="(myReply, index) in repliesList"
                    :reply="myReply"
                    :key="myReply.id"

                    v-if= "myReply.replyParentId == parentReplyId"
                    :repliesList = "repliesList"
            >
            </ViewAllReply>
        </div>

    </div>



=======
>>>>>>> 3c2fc5fb798758d12a3a3e514f3910a958fae81b
</template>

<script>


    export default {

        name: 'ViewAllReplies',

        components: {
            "ViewAllReplies":  this,

        },

        props:{
<<<<<<< HEAD
            reply: {default: null},
=======
>>>>>>> 3c2fc5fb798758d12a3a3e514f3910a958fae81b
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
