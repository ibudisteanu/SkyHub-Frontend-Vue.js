/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/24/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>
    <div class="col-xl-6 col-xl-offset-3 col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12" style='padding:0; margin-bottom:0'>

        <div class="row">
            <PreviewForums :forums="getForums" />
        </div>

        <div class="row" style='padding-bottom: 20px; padding-top:20px'>
            <ContentButtons :parentId="getForumId" :parentName="getForumName" style='text-align: center; padding-bottom:20px'/>
        </div>

        <div class="row" style='padding-bottom: 20px'>

            <div class="text-center">
                <h4 style='font-size:30px'>What's hot on {{getForumTitle}}</h4>
            </div>

            <PreviewTopics :key="'PreviewForums_'+getForumId" :title="getForumTitle" :topics="getTopics" />


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
            getTopics(){
                return this.$store.getters.getTopics;
            },

            getForums(){
                return this.$store.getters.getForums;
            },

            getForumRouter(){
                return this.$store.state.content.contentRouter.routerObject;
            },

            getForumId(){
                if (this.getForumRouter.object === null) return '';
                else return this.getForumRouter.object.id;
            },

            getForumName(){
                if (this.getForumRouter.object === null) return '';
                else return this.getForumRouter.object.name||this.getForumRouter.object.title;
            },

            getForumTitle(){
                if (this.getForumRouter.object === null) return 'SkyHub';
                else return this.getForumRouter.object.name||this.getForumRouter.object.title;
            },

        }
    }
</script>
