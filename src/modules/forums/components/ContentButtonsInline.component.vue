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

            <LoadingButton v-if="isOwner" class="btn-danger btn-rounded" style="font-size: 10px; margin-right:3px; padding: 3px 10px 3px 10px " @onClick="this.handleDelete" text="Delete" icon="fa fa-times"  ref="refSubmitButtonDelete"  />

        </div>

        <AddReplyForm v-if="showAddReply" :parentId="parentId" :parentName="parentName" :parentReplyId="this.parentReplyId" :parentReplyName="this.parentReplyName" @onSuccess="replySuccess" @onCancel="replyCancel" />

    </div>

</template>


<script>

    import AddReplyForm from 'modules/forums/replies/components/AddReply.form.vue';
    import LoadingButton from 'client/components/util-components/UI/buttons/LoadingButton.vue';

    export default{
        name: 'ContentButtonsInline',

        components:{
            'AddReplyForm' : AddReplyForm,
            'LoadingButton' : LoadingButton,
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

            async handleDelete(e){
                e.preventDefault();

                if (this.$refs['refSubmitButtonDelete'].disabled === true) // avoid multiple post requests
                    return false;

                let answer = await this.$store.dispatch('CONTENT_DELETE_OBJECT', { objectId: this.parentReplyId||this.parentId } );
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