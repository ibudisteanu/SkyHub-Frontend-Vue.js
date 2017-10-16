/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

    <div>

        <HeaderCover
                title="SkyHub Social Network"
                subTitle="Change the world together"
        />

    </div>

</template>


<script>

    import HeaderCover from 'client/components/Template/Template-components/Header/Cover/HeaderCover.component.vue';

    export default{
        name: "ViewHome",

        components: {
            'HeaderCover': HeaderCover,
        },


    }
</script>