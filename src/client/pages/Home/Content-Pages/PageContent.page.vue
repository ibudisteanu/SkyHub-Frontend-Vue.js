/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

    <div>
        <ViewHome v-if="getCurrentRouterObjectType === 'home' " />

        <ViewForum v-else-if="getCurrentRouterObjectType === 'forum'"/>

        <ViewTopic v-else-if="getCurrentRouterObjectType === 'topic'"/>

        <NotFound v-else="" />

    </div>

</template>

<script>

    import ViewForum from './pages/ViewForum.page.vue';
    import ViewTopic from './pages/ViewTopic.page.vue';
    import ViewHome from './pages/ViewHome.page.vue';
    import NotFound from './pages/NotFound.page.vue';

    import User from 'models/User/User.model';

    export default{
        name: 'PageContent',

        components:{
            'ViewForum':ViewForum,
            'ViewTopic':ViewTopic,
            'ViewHome':ViewHome,
            'NotFound': NotFound,
        },

        computed:{
            getCurrentRouterObjectType(){
                return this.$store.state.content.contentRouter.currentObject.type;
            },

            isAuthenticated(){
                return this.$store.getters.isAuthenticatedUserLoggedIn;
            }
        }

    }
</script>
