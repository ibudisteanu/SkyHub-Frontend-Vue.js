/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

        <div v-if="getCurrentRouterObjectType === 'home' ">
            <AuthenticatedHome v-if="isAuthenticated"/>
            <NotAuthenticatedHome v-else />
        </div>
        <div v-else>
            <ViewForum v-if="getCurrentRouterObjectType === 'forum'"/>

            <ViewTopic v-else-if="getCurrentRouterObjectType === 'topic'"/>
        </div>

</template>

<script>

    import AuthenticatedHome from './home-page/AuthenticatedHome.page.vue';
    import NotAuthenticatedHome from './home-page/NotAuthenticatedHome.page.vue';
    import ViewForum from './pages/ViewForum.page.vue';
    import ViewTopic from './pages/ViewTopic.page.vue';

    import User from 'models/User/User.model';

    export default{
        name: 'PageContent',

        components:{
            'ViewForum':ViewForum,
            'ViewTopic':ViewTopic,
            'AuthenticatedHome': AuthenticatedHome,
            'NotAuthenticatedHome': NotAuthenticatedHome,
        },

        computed:{
            getCurrentRouterObjectType(){
                return this.$store.state.content.contentRouter.routerObject.type;
            },

            isAuthenticated(){
                return User.isLoggedIn(this.$store.state.authenticatedUser);
            }
        }

    }
</script>
