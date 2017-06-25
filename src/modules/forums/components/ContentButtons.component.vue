/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/24/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>
    <div >

        <div :style="style">

            <button v-if="enableAddForum && showAddForum" type="button" class="btn btn-warning dim btn-rounded" data-toggle="button" aria-pressed="true"  @click={handleAddForum} style='margin-right: 5px' >
                <i class="fa fa-users" style='margin-right: 5px' />
                Forum
            </button>

            <button v-if="enableAddTopic && showAddTopic" type="button" class="btn btn-success dim btn-rounded" @click={::this.handleAddTopic} style={{marginRight: 5}} >
                <i class="fa fa-pencil" style='margin-right: 5px' />
                Topic
            </button>

            <button v-if="enableAddReply && showAddReply" type="button" class="btn btn-danger dim btn-rounded" @click={::this.handleAddTopic} style={{marginRight: 5}} >
                <i class="fa fa-comment" style='margin-right: 5px' />
                Reply
            </button>

        </div>

        <AddForumForm v-if="showAddForum" :parentId="parentId" parentName={this.props.parentName} />

        <AddTopicForm v-if="showAddTopic" :parentId="parentId" parentName={this.props.parentName}/>

        {this.state.showAddForumForm ? this.showAddForum() : ''}

        {this.state.showAddTopicForm ? this.showAddTopic() : ''}

    </div>

</template>


<script>

    export default{
        name: 'ContentButtons',

        data: function (){
            return {
                showAddForumForm : false,
                showAddTopicForm : false,
                showAddReplyForm : false,
            }
        },

        props:{
            parentId : {default: '' },
            parentName : {default: ''},

            enableAddForum : {default: true},
            enableAddTopic : {default: true},
            enableAddReply : {default: true},
            
            style : {default: ''},
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

        }
    }

</script>
