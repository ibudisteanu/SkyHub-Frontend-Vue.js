/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/18/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

    <tr>
        <td :key="'TopicTable_'+topic.id" class="anchor">

            <div class="anchor" style='padding-left: 42px'>

                <router-link :to="topic.URL" :disableLink="topic.preview" >
                    <img class="table-forums-topic-image" :src="getTopicImage" :alt="getTopicTitle" />

                    <h4 class="table-forums-topic-title">{{getTopicTitle}}</h4>

                    <p class="table-forums-topic-body word-wrap">
                        <div v-html="getTopicDescription"/>
                    </p>

                </router-link>

            </div>


            <div style='display: inline'>

                {{topic.authorId}}

                <ShowDate :date="topic.dtCreation" />

            </div>


            <br />

            <div class="topic-question-footer">
                <ContentButtonsInline  buttonsRowStyle="paddingBottom: 10px" :parentId="this.topic.id" :parentName="this.topic.title" replyParentId="" replyParentName=""/>
            </div>

        </td>
        <td>0<br /> </td>
        <td>0<br /> </td>
    </tr>

</template>




<script>

    import Topic from 'models/Topic/Topic.model';
    import ShowDate from 'client/components/util-components/UI/show-date/ShowDate.component.vue';

    import ContentButtonsInline from 'modules/forums/components/ContentButtonsInline.component.vue';

    export default{

        name: '',

        components: {
            'ShowDate' : ShowDate,
            'ContentButtonsInline' : ContentButtonsInline,
        },

        props:{
            topic:  {default: null},
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
        }

    }

</script>
