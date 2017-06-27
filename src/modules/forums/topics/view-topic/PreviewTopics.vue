/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/18/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

    <table class="table table-hover table-forums parent-table">
        <tbody>

                <tr v-if="hideHeader">
                </tr>
                <tr v-if="!hideHeader">
                    <th>

                        <h3>
                            <i class="fa fa-comments table-forums-icon table-forums-icon" style="padding-right: 5px"></i> {{title||''}}
                        </h3>

                    </th>
                    <th><i class="fa fa-comments-o table-forums-icon" aria-hidden="true"></i></th>
                    <th><i class="fa fa-eye table-forums-icon" aria-hidden="true"></i></th>
                </tr>


                <PreviewTopic
                        v-for="(topic, index) in topics"
                        :topic="topic"
                        :key="'PreviewTopic_'+topic.id||''"
                />


        </tbody>
    </table>

</template>


<script>

    import PreviewTopic from './PreviewTopic.vue';

    export default{
        name: 'PreviewTopics',

        components: {
            'PreviewTopic' : PreviewTopic,
        },

        props: {
            topics: {default: []},
            hideHeader: {default: false},
            title: {title: 'no title'},
        }


    }

</script>
