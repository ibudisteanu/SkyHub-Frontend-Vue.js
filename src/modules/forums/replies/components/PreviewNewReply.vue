/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/29/2017.
 * (C) BIT TECHNOLOGIES
 */


<template>

    <div style='background-color: aliceblue;'>

        <ViewReply :reply="this.reply"  />

    </div>

</template>




<script>

    import Reply from 'models/Reply/Reply.model';
    export default{

        name: 'PreviewNewTopic',

        props:{
            title: {default: ''},
            image: {default: ''},
            description: {default: ''},
            attachments: {default: []},
            authorId: {default: ''},
        },

        computed: {
            reply: function (){

                console.log('reply title '+this.title);
                console.log(this.attachments);

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
        },

        beforeCreate: function () {

            if ((typeof this !== 'undefined')&&(typeof this.$options !== 'undefined'))
                this.$options.components.ViewReply = require('./../view-reply/ViewReply.vue')
        },

    }


</script>
