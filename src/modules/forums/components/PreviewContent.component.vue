/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/4/2017.
 * (C) BIT TECHNOLOGIES
 */


/*
    IT IS NO LONGER USED
*/

<template>



</template>

<script>

    import ContentObjectService from 'store/helpers/ContentObject.service';

    export default{
        name: 'PreviewContent',

        props: {
            object: {default: null},
            showPreview: {default: false},
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
