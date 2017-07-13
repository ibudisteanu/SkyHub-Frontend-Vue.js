/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/18/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

    <tr>
        <td :key="'TopicTable_'+topic.id" class="anchor">

            <Voting :parentId = "topic.id" :preview="this.preview" />

            <div>
                <div class="anchor" style='padding-left: 42px' >

                    <router-link :to="'/'+topic.URL" :disableLink="this.preview" >
                        <img v-if="getTopicImage !== ''" class="table-forums-topic-image" :src="getTopicImage" :alt="getTopicTitle" />

                        <h4 class="table-forums-topic-title" v-html="getTopicTitle"></h4>

                        <p class="table-forums-topic-body word-wrap">
                            <div v-html="getTopicDescription"/>
                        </p>

                    </router-link>

                </div>

                <div class="clearfix" />


                <ViewUserForum style='display: inline' :authorId="topic.authorId">

                    <ShowDate :date="topic.dtCreation" slot="view-user-bottom"/>

                </ViewUserForum>

                <br />

                <div class="topic-question-footer" v-if="!this.preview">
                    <ContentButtonsInline  buttonsRowStyle="paddingBottom: 10px" :parentId="this.topic.id" :parentName="this.topic.title" :isOwner="this.$store.state.authenticatedUser.user , this.topic | checkOwner" parentReplyId="" parentReplyName=""/>
                </div>

                <div class="clearfix" />

            </div>

            <ViewAllReplies style="padding-left: 40px; padding-bottom: 20px;"

                    :parentId = "this.topic.id"
                    parentReplyId = ""
                    :key = "'ViewReplies_'+this.topic.id+'_'"

                    :preview = "this.preview"

            >
            </ViewAllReplies>

        </td>
    </tr>

</template>




<script>

    import {checkOwner} from 'modules/utils/global-utilities/UtilitiesFunctions';

    import Topic from 'models/Topic/Topic.model';

    import ShowDate from 'client/components/util-components/UI/show-date/ShowDate.component.vue';
    import Voting from  'modules/forums/voting/Voting.component.vue'
    import ViewAllReplies from  'modules/forums/replies/view-reply/ViewAllReplies.vue'
    import ContentButtonsInline from 'modules/forums/components/ContentButtonsInline.component.vue';

    import ViewUserForum from 'modules/users/view-users/ViewUserForum.component.vue';

    export default{

        name: '',

        components: {
            'ShowDate' : ShowDate,
            'ContentButtonsInline' : ContentButtonsInline,
            'Voting': Voting,
            'ViewAllReplies': ViewAllReplies,
            'ViewUserForum' : ViewUserForum,
        },

        props:{
            topic:  {default: null},
            preview: {default: false},
        },

        mounted: function () {
            this.$store.dispatch('CONTENT_USERS_GET', {userId: this.topic.authorId})
        },

        computed: {
            getTopicImage(){
                return Topic.getImage(this.topic) || "";
            },

            getTopicTitle(){
                return Topic.getTitle(this.topic)||'no title';
            },

            getTopicDescription(){
                return Topic.getDescription(this.topic)||'no description';
            },

        }

    }

</script>
