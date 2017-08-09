/**
* Created by Alexandru Ionut Budisteanu - SkyHub on 6/18/2017.
* (C) BIT TECHNOLOGIES
*/

/*
Infinite Scroll: https://github.com/ElemeFE/vue-infinite-scroll
*/

<template>
    <div>
        <table class="table table-hover table-forums parent-table">
            <tbody>

            <tr v-if="showTablePreview">
            </tr>
            <tr v-if="!showTablePreview">
                <th>

                    <h3>
                        <i class="fa fa-comments table-forums-icon table-forums-icon" style="padding-right: 5px"></i> {{title||''}}
                    </h3>

                </th>
            </tr>


            <PreviewTopic
                    v-for="(topic, index) in topics"
                    :topic="topic"
                    :key="'PreviewTopic_'+topic.id||''"
                    :showPreview="true"
                    :showTablePreview="this.showTablePreview"
            >
            </PreviewTopic>


            </tbody>
        </table>

        <MyInfiniteScroll :hasNext="this.hasNext" @onScroll="this.loadMore" ref="refInfiniteLoading"/>

        <div v-if="error !== ''">
            <div class="alert alert-danger alert-dismissable">
                <div v-html="this.error" />
            </div>
        </div>

    </div>

</template>


<script>
    import MyInfiniteScroll from 'client/components/util-components/UI/infinite-scroll/MyInfiniteScroll.vue';
    import PreviewTopic from './PreviewTopic.vue';

    export default{
        name: 'PreviewTopics',

        components: {
            'PreviewTopic' : PreviewTopic,
            'MyInfiniteScroll' : MyInfiniteScroll,
        },

        props: {
            topics: {default: [] },
            hasNext: {default: true},
            parentId: {default: ''},

            showTablePreview: {default: false},
            title: {title: 'no title'},
        },

        data() {
            return {
                error: '',
            }
        },

        computed:{

        },

        methods:{

            async loadMore(){

                if (this.showTablePreview === true) return false;

                try{
                    await this.$store.dispatch('CONTENT_TOPICS_FETCH_TOP_NEXT', {parent: this.parentId} );
                    this.$refs['refInfiniteLoading'].scrollContinue();
                } catch(Exception){
                    this.error = "Error! Couldn't load  the topics " + Exception.toString();
                }

            }

        }


    }

</script>
