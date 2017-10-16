/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

    <div>
        <ViewHome v-if="getCurrentRouterObjectType === 'home' " />

        <NotFound v-else="" />

    </div>

</template>

<script>

    import ViewHome from './pages/ViewHome.page.vue';
    import NotFound from './pages/NotFound.page.vue';

    import User from 'models/User/User.model';

    export default{
        name: 'PageContent',

        components:{
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
