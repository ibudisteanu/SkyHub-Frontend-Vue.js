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

        <DisplayForumContent />

    </div>

</template>


<script>

    import HeaderCover from 'client/components/Template/Template-components/Header/Cover/HeaderCover.component.vue';
    import DisplayForumContent from 'modules/forums/forums/view-forum/DisplayForumContent.vue';

    export default{
        name: "NotAuthenticatedHomePage",

        components: {
            'HeaderCover': HeaderCover,
            'DisplayForumContent' : DisplayForumContent,
        },


    }
</script>