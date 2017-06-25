/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/4/2017.
 * (C) BIT TECHNOLOGIES
 */


<template>

    <PreviewForums v-if="getObjectType === 'forum'" :key="'previewForum_'+object.id" :forum="object" />

    <PreviewTopic v-if="getObjectType === 'topic'" :key="'previewTopic_'+object.id" :topic="object" />

</template>

<script>

    import ContentObjectService from 'store/helpers/ContentObject.service';

    export default{
        name: 'PreviewContent',

        props: {
            object: {default: null},
        },

        computed:{
            getObjectType () {
                let extractedIdData = ContentObjectService.extractDataFromIds(object.id||'');
                let objectType = extractedIdData.objectType || '';
            },
        },

        methods:{

        }

    }
</script>
