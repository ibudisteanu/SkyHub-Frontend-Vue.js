/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/18/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

    <table class="table table-hover table-forums parent-table">
        <tbody>

        <tr>
            <div v-if="!hideHeader">
                <th>

                    <h3>
                        <i class="fa fa-comments table-forums-icon table-forums-icon" style="padding-right: 5px"></i> {{title||''}}
                    </h3>

                </th>
                <th><i class="fa fa-comments-o table-forums-icon" aria-hidden="true"></i></th>
                <th><i class="fa fa-eye table-forums-icon" aria-hidden="true"></i></th>
            </div>
        </tr>


        <PreviewTopic
                v-for="(topic, index) in topics"
                :forum="topic"
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

        }


    }

</script>
