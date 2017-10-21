/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

    <div>

        <WebDollarHeaderCover />

    </div>

</template>


<script>

    import HeaderCover from 'client/components/Template/Template-components/Header/Cover/HeaderCover.component.vue';
    import WebDollarHeaderCover from 'client/components/Template/Template-components/Header/Cover/WebDollarHeaderCover.component.vue';

    export default{

        name: "ViewHome",

        components: {
            'HeaderCover': HeaderCover,
            'WebDollarHeaderCover': WebDollarHeaderCover,
        },


    }
</script>