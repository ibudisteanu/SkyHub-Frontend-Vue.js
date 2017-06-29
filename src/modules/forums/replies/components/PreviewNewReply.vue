/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/29/2017.
 * (C) BIT TECHNOLOGIES
 */


<template>

    <div style='background-color: aliceblue;'>

        <PreviewReply :reply="this.reply"  />

    </div>

</template>




<script>

    import Reply from 'models/Reply/Reply.model';
    import PreviewReply from 'modules/forums/replies/view-reply/ViewReply.vue'

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
            authorId: {default: ''},
        },

        computed: {
            reply: function (){

                console.log('reply title '+this.title);

                return new Reply({
                    title: this.title,
                    image: this.image,
                    description: this.description,
                    authorId: this.authorId,
                    attachments: this.attachments,

                    dtCreation: '',

                    preview: true,
                })
            },
        }

    }


</script>
