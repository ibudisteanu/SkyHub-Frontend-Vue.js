/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/29/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

    <div class="lightBoxGallery">

        <DisplayAttachment
                v-for="(attachment, index) in attachments"
                :attachment="attachment"
                :key="'Attachment_'+(parentId||'')+'_'+index"
        />


    </div>

</template>


<script>

    import DisplayAttachment from './DisplayAttachment.vue';

    export default{

        name: 'DisplayAttachments',

        components:{
            'DisplayAttachment': DisplayAttachment,
        },

        props:{

            attachments : {default: function(){return [] }},
            parentId: {default: ''},

        },

    },

</script>