/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/21/2017.
 * (C) BIT TECHNOLOGIES
 */


<template>
    
    <div class="col-xl-6 col-xl-offset-3 col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12" style='padding:0; margin-bottom:0'>

        <div class="row" style='padding-bottom: 20px; padding-top: 20px'>
            <ContentButtons :parentId="getForumId" :parentName="getForumName" style="text-align: center; padding-bottom:20px"/>
        </div>

        <div class="row" style="padding-bottom: 20px">


        </div>


    </div>    
    
</template>




<script>

    import PreviewAllTopics from './PreviewTopics.vue';

    export default{
        name: 'DisplayTopicContent',

        components: {
            'PreviewAllTopics': PreviewAllTopics,
        },

        computed:{


        },
    }
    
</script>
