/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/29/2017.
 * (C) BIT TECHNOLOGIES
 */


<template>

    <div>
        <div :style="buttonsRowStyle">
            <a class="btn btn-success btn-rounded" type="button" style="font-size: 10px; margin-right:3px; padding: 3px 10px 3px 10px " @click="this.handleAddReply">
                <i class="fa fa-comment" ></i>
                <span> Reply</span>
            </a>

            <a class="btn btn-danger btn-rounded" v-if="isOwner" type="button" style="font-size: 10px; margin-right:3px; padding: 3px 10px 3px 10px " @click="this.handleDeleteReply">
                <i class="fa fa-comment" ></i>
                <span> Delete</span>
            </a>

        </div>

        <AddReplyForm v-if="showAddReply" :parentId="parentId" :parentName="parentName" :parentReplyId="this.parentReplyId" :parentReplyName="this.parentReplyName" @onSuccess="replySuccess" @onCancel="replyCancel" />

    </div>

</template>


<script>

    import AddReplyForm from 'modules/forums/replies/components/AddReply.form.vue';

    export default{
        name: 'ContentButtonsInline',

        components:{
            'AddReplyForm' : AddReplyForm,
        },

        data: function () {
            return {
                showAddReply : false,
            }
        },

        props:{
            parentId: {default: ''},
            parentName : {default: ''},
            isOwner: {default: false},

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

            handleDeleteReply(e){
                e.preventDefault();


                console.log('Am dat click pe Delete', this.parentReplyId||this.parentId);

                this.$store.dispatch('CONTENT_DELETE_OBJECT', { objectId: this.parentReplyId||this.parentId } )
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