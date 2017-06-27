/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>
    <div>

        <DisplayForumContent />

        
    </div>
</template>


<script>

    import HeaderCover from 'client/components/Template/Template-components/Header/Cover/HeaderCover.component.vue';
    import DisplayForumContent from 'modules/forums/forums/view-forum/DisplayForumContent.vue';

    export default{
        name: "AuthenticatedHomePage"
    }
</script>