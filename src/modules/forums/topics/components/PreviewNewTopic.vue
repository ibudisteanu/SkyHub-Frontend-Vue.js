/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/18/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

    <div style='background-color: aliceblue;'>

        <PreviewTopics :preview="true" :topics="[this.topic]" />

    </div>

</template>




<script>

    import Topic from 'models/Topic/Topic.model';
    import PreviewTopics from 'modules/forums/topics/view-topic/PreviewTopics.vue'

    export default{

        name: 'PreviewNewTopic',

        components:{
            'PreviewTopics': PreviewTopics,
        },

        props:{
            title: {default: ''},
            image: {default: ''},
            description: {default: ''},
            attachments: {default: ''},
            keywords: {default: []},
            authorId: {default: ''},
        },

        computed: {
            topic: function (){
                return new Topic({
                    title: this.title,
                    image: this.image,
                    description: this.description,
                    keywords: this.keywords,
                    authorId: this.authorId,
                    attachments: this.attachments,

                    dtCreation: '',

                    preview: true,
                })
            },
        }

    }


</script>
