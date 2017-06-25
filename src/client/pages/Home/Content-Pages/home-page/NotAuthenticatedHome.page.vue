/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

         <HeaderCover
                       title="SkyHub Social Network"
                       subTitle="Change the world together"
         />


</template>


<script>

    import HeaderCover from 'client/components/Template/Template-components/Header/Cover/HeaderCover.component.vue'

    export default{
        name: "NotAuthenticatedHomePage",

        components: {
            'HeaderCover': HeaderCover,
        },


    }
</script>