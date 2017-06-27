/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/24/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>
    <div class="col-xl-6 col-xl-offset-3 col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12" style='padding:0; margin-bottom:0'>

        <div class="row">
            <PreviewForums :forums="getContentForums" />
        </div>

        <div class="row" style='padding-bottom: 20px; padding-top:20px'>
            <ContentButtons :parentId="getForumId" :parentName="getForumName" buttonsStyle="text-align: center; padding-bottom:20px" />
        </div>

        <div class="row" style='padding-bottom: 20px'>

            <div class="text-center" style='padding-bottom: 40px'>
                <h4 style='font-size:30px'>What's hot on {{getForumTitle}}</h4>
            </div>

            <PreviewTopics :key="'PreviewForums_'+getForumId" :title="getForumTitle" :topics="getContentTopics" />

        </div>


    </div>
</template>

<script>

    import PreviewForums from './PreviewForums.vue';
    import PreviewTopics from 'modules/forums/topics/view-topic/PreviewTopics.vue';

    import ContentButtons from 'modules/forums/components/ContentButtons.component.vue';

    export default{
        name: 'DisplayForumContent',

        components: {
            'PreviewForums': PreviewForums,
            'PreviewTopics': PreviewTopics,
            'ContentButtons': ContentButtons,
        },

        computed:{
            getContentTopics(){
                return this.$store.getters.getTopics;
            },

            getContentForums(){
                return this.$store.getters.getForums;
            },




            getForum(){
                return this.$store.state.content.contentRouter.routerObject;
            },

            getForumId(){
                if (this.getForum.object === null) return '';
                else return this.getForum.object.id;
            },

            getForumName(){
                if (this.getForum.object === null) return '';
                else return this.getForum.object.name||this.getForum.object.title;
            },

            getForumTitle(){
                if (this.getForum.object === null) return 'SkyHub';
                else return this.getForum.object.name||this.getForum.object.title;
            },

        }
    }
</script>
