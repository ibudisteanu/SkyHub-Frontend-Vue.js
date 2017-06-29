/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/29/2017.
 * (C) BIT TECHNOLOGIES
 */


<template>

    <div style='background-color: aliceblue;'>

        <PreviewReply :hideHeader="true" :topics="[this.topic]" />

    </div>

</template>




<script>

    import Reply from 'models/Reply/Reply.model';
    import PreviewReply from 'modules/forums/replies/view-reply/ViewReply'

    export default{

        name: 'PreviewNewTopic',

        components:{
            'PreviewReply': PreviewReply,
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
