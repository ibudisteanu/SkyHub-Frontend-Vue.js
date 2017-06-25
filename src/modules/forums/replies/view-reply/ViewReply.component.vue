/**
 * Created by BIT TECHNOLOGIES on 5/28/2017.
 */

/*
    PreviewForum can also work with a prop id="1_frm_3333", and it fetch automatically the forum from you
 */

<template>

    <div class="media">
        <a class="forum-avatar" href="#">
            <img :src="reply.authorId" class="img-circle" alt="image" />
            <div class="author-info">
                <strong>Posts:</strong> 542<br />
                <strong>Joined:</strong> April 11.2015<br />
            </div>
        </a>

        <div class="media-body">
            <h4 class="media-heading">{{reply.title || '' }} </h4>
          <div  v-if="reply.authorId !== ''" > {{reply.authorId}} , {{reply.authorId}}</div>)
        </div>
            <p>   {{reply.description}}</p>
    </div>

</template>
<script>

     import Reply from "models/Reply/Reply.model";

    export default {

        props:{
            reply:null,
        },

        computed : {Reply(){
            return Reply;
        }},

        data: function () {
            return {


            }
        }
    }
</script>

