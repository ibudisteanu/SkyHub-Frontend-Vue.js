/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/24/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>
    <div>
        <div class="col-xl-6 col-xl-offset-3 col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12" style='padding:0; margin-bottom:0'>

            <div v-if="pageType !== 'pages'">
                <div class="row">
                    <PreviewForums :forums="forums" :parentId="getForumId" :hasNext="this.forumsHasNext" />
                    <Pagination hidden="true" :url="this.getURL" :pageIndex="this.forumsPageIndex" :hasNext="forumsHasNext" prefix="forums" />
                </div>

                <div class="row" style='padding-bottom: 20px; padding-top:20px'>
                    <ContentButtons :enableAddReply="false"
                                    :parentForumId="getForumId" :parentForumName="getForumName"
                                    buttonsRowStyle="text-align: center; padding-bottom:20px" />
                </div>

                <div class="row" style='padding-bottom: 20px'>

                    <div class="text-center" style='padding-bottom: 40px'>
                        <h4 style='font-size:30px'>What's hot on {{this.getForumTitle}}</h4>
                    </div>

                    <PreviewTopics :key="'PreviewForums_'+getForumId" :title="this.getForumTitle" :topics="this.contentTopics" :parentId="this.getForumId" :hasNext="this.topicsHasNext" />

                    <Pagination hidden="true" :url="this.getURL" :pageIndex="this.topicsPageIndex" :hasNext="this.topicsHasNext" />


                    <router-link class="page-link invizibil-element" :to="this.getURL+'pages'">
                        View All Pages
                    </router-link>

                </div>
            </div>

            <div v-if="pageType === 'pages'">
                <AllPages />
            </div>

        </div>

    </div>

</template>

<script>

    import PreviewForums from './PreviewForums.vue';
    import PreviewTopics from 'modules/forums/topics/view-topic/PreviewTopics.vue';

    import ContentButtons from 'modules/forums/components/ContentButtons.component.vue';
    import Pagination from 'client/components/util-components/UI/pagination/Pagination.component.vue';

    import AllPages from 'client/components/util-components/UI/all-pages/AllPages.component.vue';

    export default{
        name: 'DisplayForumContent',

        components: {
            'PreviewForums': PreviewForums,
            'PreviewTopics': PreviewTopics,
            'ContentButtons': ContentButtons,
            'Pagination' : Pagination,
            'AllPages': AllPages,
        },

        computed:{

            getForum(){
                return this.$store.state.content.contentRouter.currentObject;
            },

            getURL(){
                return this.$store.state.content.contentRouter.currentObject.pageURL;
            },


            contentTopics(){
                return this.$store.getters.getTopics;
            },

            pageType(){
                return this.$store.state.content.contentRouter.pageType;
            },

            topicsHasNext(){
                return this.$store.state.content.contentTopics.hasNext;
            },

            topicsPageIndex(){
                return this.$store.state.content.contentTopics.pageIndex;
            },

            forums(){
                return this.$store.getters.getForums;
            },

            forumsHasNext(){
                return this.$store.state.content.contentForums.hasNext;
            },

            forumsPageIndex(){
                return this.$store.state.content.contentForums.pageIndex;
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
                else return this.getForum.object.title||this.getForum.object.name;
            },

        }
    }
</script>
