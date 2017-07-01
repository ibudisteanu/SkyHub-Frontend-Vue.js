/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/21/2017.
 * (C) BIT TECHNOLOGIES
 */


<template>
    <div class="row">
        <div class="col-xl-6 col-xl-offset-3 col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12" style='padding:0; margin-bottom:0'>

            <div class="row" style='padding-bottom: 20px; padding-top: 20px'>
                <ContentButtons :parentId="getTopicId" :parentName="getForumName" buttonsRowStyle="text-align: center; padding-bottom:20px"/>
            </div>

            <div class="row" style="padding-bottom: 20px">


            </div>


        </div>
    </div>
    
</template>




<script>

    import PreviewAllTopics from './PreviewTopics.vue';
    import ContentButtons from 'modules/forums/components/ContentButtons.component.vue';

    export default{
        name: 'DisplayTopicContent',

        components: {
            'PreviewAllTopics': PreviewAllTopics,
            'ContentButtons' : ContentButtons,
        },

        props : {
            topic: {default: null}
        },

        computed:{

            getContentReplies(){
                //return this.$store.getters.getForums;
            },





            getTopic(){
                if (this.topic !== null) return this.topic;
                else return this.$store.state.content.contentRouter.routerObject;
            },

            getTopicId(){
                if (this.getTopic.object === null) return '';
                else return this.getTopic.object.id;
            },

            getForumName(){
                if (this.getTopic.object === null) return '';
                else return this.getTopic.object.name||this.getTopic.object.title;
            },

            getForumTitle(){
                if (this.getTopic.object === null) return 'SkyHub';
                else return this.getTopic.object.name||this.getTopic.object.title;
            },

        },
    }
    
</script>
