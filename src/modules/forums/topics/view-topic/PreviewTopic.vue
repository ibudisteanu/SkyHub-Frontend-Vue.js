/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/18/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

    <tr>
        <td :key="'TopicTable_'+topic.id" class="anchor">

            <Voting :parentId = "topic.id" />

            <div>
                <div class="anchor" style='padding-left: 42px'>

                    <router-link :to="'/'+topic.URL" :disableLink="topic.preview" >
                        <img class="table-forums-topic-image" :src="getTopicImage" :alt="getTopicTitle" />

                        <h4 class="table-forums-topic-title">{{getTopicTitle}}</h4>

                        <p class="table-forums-topic-body word-wrap">
                            <div v-html="getTopicDescription"/>
                        </p>

                    </router-link>

                </div>


                <div style='display: inline'>

                    <img :src="this.getUserProfilePic" class="img-circle" align="left" alt="image" style='max-width: 48px; max-height: 48px; margin-right: 10px' />
                    <h4 class="reply-header-authorName">{{ this.getUserFullName }} </h4>
                    <h5 class="reply-header-bio">{{ this.getUserBio }} </h5>

                    <ShowDate :date="topic.dtCreation" />

                </div>

                <br />

                <div class="topic-question-footer">
                    <ContentButtonsInline  buttonsRowStyle="paddingBottom: 10px" :parentId="this.topic.id" :parentName="this.topic.title" parentReplyId="" parentReplyName=""/>
                </div>

                <div class="clearfix">

                </div>

            </div>

            <ViewAllReplies style="padding-left: 40px"

                    :parentId = "this.topic.id"
                    parentReplyId = ""
                    :key = "'ViewReplies_'+this.topic.id+'_'"

            >
            </ViewAllReplies>

        </td>
    </tr>

</template>




<script>

    import Topic from 'models/Topic/Topic.model';
    import User from 'models/User/User.model';

    import ShowDate from 'client/components/util-components/UI/show-date/ShowDate.component.vue';
    import Voting from  'modules/forums/voting/Voting.component.vue'
    import ViewAllReplies from  'modules/forums/replies/view-reply/ViewAllReplies.vue'
    import ContentButtonsInline from 'modules/forums/components/ContentButtonsInline.component.vue';


    export default{

        name: '',

        components: {
            'ShowDate' : ShowDate,
            'ContentButtonsInline' : ContentButtonsInline,
            'Voting': Voting,
            'ViewAllReplies': ViewAllReplies,
        },

        props:{
            topic:  {default: null},
        },

        mounted: function () {
            this.$store.dispatch('CONTENT_USERS_GET', {userId: this.topic.authorId})
        },

        computed: {
            getTopicImage(){
                return Topic.getImage(this.topic) || "https://citation-beweb.netdna-ssl.com/img/compose.png";
            },

            getTopicTitle(){
                return Topic.getTitle(this.topic)||'no title';
            },

            getTopicDescription(){
                return Topic.getDescription(this.topic)||'no description';
            },


            user() {
                return this.$store.state.content.contentUsers.users[this.topic.authorId];
            },

            getUserFullName(){
                return typeof this.user !== 'undefined' ? User.getName(this.user) :  this.topic.authorId;
            },

            getUserBio(){
                return typeof this.user !== 'undefined' ? this.user.shortBio :  'bio';
            },

            getUserProfilePic(){
                return typeof user !== 'undefined' ? user.profilePic : 'https://forums.carm.org/vb5/core/images/default/default_avatar_medium.png';
            }
        }

    }

</script>
