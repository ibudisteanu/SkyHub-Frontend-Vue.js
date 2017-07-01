/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/29/2017.
 * (C) BIT TECHNOLOGIES
 */


<template>

    <div>
        <div :style="buttonsRowStyle">
            <a class="btn btn-success btn-rounded" type="button" style="padding-top: 3px; padding-bottom: 3px" @click="this.handleAddReply">
                <i class="fa fa-comment" ></i> Reply
            </a>
        </div>

        <AddReplyForm v-if="showAddReply" :parentId="parentId" :parentName="parentName" :parentReplyId="this.parentReplyId" :parentReplyName="this.parentReplyName" :onSuccess="replySuccess" :onCancel="replyCancel" />

    </div>

</template>


<script>

    import AddReplyForm from 'modules/forums/replies/components/AddReply.form.vue';

    export default{
        name: 'ContentButtonsLine',

        components:{
            'AddReplyForm' : AddReplyForm,
        },

        data: function () {
            return {
                showAddReply : false,
            }
        },

        props:{
            parentId : {default: '' },
            parentName : {default: ''},
            parentReplyId : {default: ''},
            parentReplyName : {default: ''},

            buttonsRowStyle : {default: ''},

            enableAddReply : {default: true},
        },

        methods:{
            handleAddReply(e){
                e.preventDefault(); e.stopPropagation();

                this.showAddReply = true;
            },

            replySuccess(){
                this.showAddReply = false;
            },

            replyCancel(){
                this.showAddReply = false;
            }
        },

    }

</script>