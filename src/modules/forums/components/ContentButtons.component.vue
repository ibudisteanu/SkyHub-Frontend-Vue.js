/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/24/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>
    <div >


        <div :style="buttonsStyle">

            <button v-if="enableAddForum" type="button" class="btn btn-warning dim btn-rounded" data-toggle="button" aria-pressed="true"  @click="handleAddForum" style='margin-right: 5px' >
                <i class="fa fa-users" style='margin-right: 5px' />
                Forum
            </button>

            <button v-if="enableAddTopic" type="button" class="btn btn-success dim btn-rounded" @click="handleAddTopic" style='margin-right: 5px' >
                <i class="fa fa-pencil" style='margin-right: 5px' />
                Topic
            </button>

            <button v-if="enableAddReply" type="button" class="btn btn-danger dim btn-rounded" @click="handleAddTopic" style='margin-right: 5px' >
                <i class="fa fa-comment" style='margin-right: 5px' />
                Reply
            </button>

        </div>


        <AddForumForm v-show="showAddForum" :parentId="parentId" :parentName="parentName" :onSuccess="forumSuccess" />

        <AddTopicForm v-show="showAddTopic" :parentId="parentId" :parentName="parentName" :onSuccess="topicSuccess"/>



    </div>

</template>


<script>

    import AddForumForm from 'modules/forums/forums/components/AddForum.form.vue';
    import AddTopicForm from 'modules/forums/topics/components/AddTopic.form.vue';

    export default{
        name: 'ContentButtons',

        components:{
            'AddForumForm':AddForumForm,
            'AddTopicForm':AddTopicForm,
        },

        data: function (){
            return {
                showAddForum : false,
                showAddTopic : false,
                showAddReply : false,
            }
        },

        props:{
            parentId : {default: '' },
            parentName : {default: ''},

            enableAddForum : {default: true},
            enableAddTopic : {default: true},
            enableAddReply : {default: true},

            buttonsStyle: {default: function (){return {} }},
        },

        methods:{
            handleAddForum(e){
                //e.preventDefault(); e.stopPropagation();

                this.showAddForum = true;
                this.showAddTopic = false;
                this.showAddReply = false;
            },

            handleAddTopic(e){
                e.preventDefault(); e.stopPropagation();

                this.showAddForum = false;
                this.showAddTopic = true;
                this.showAddReply = false;
            },

            handleAddReply(e){
                e.preventDefault(); e.stopPropagation();

                this.showAddForum = false;
                this.showAddTopic = false;
                this.showAddReply = true;
            },

            topicSuccess(){
                this.showAddTopic = false;
            },

            topicCancel(){
                this.showAddTopic = false;
            },

            forumSuccess(){
                this.showAddForum = false;
            },

            forumCancel(){
                this.showAddForum = false;
            }

        }
    }

</script>
