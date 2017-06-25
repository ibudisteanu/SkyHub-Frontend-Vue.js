/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

        <Layout>
             "About Skyhub"
        </Layout>

</template>

<script>

import Layout from 'client/components/Template/Layout/Layout.vue';

export default {

    name: 'HomePage',

    components: { Layout },

    async asyncData ({ store,  route: { params: { url }} }) {

        console.log("%%%%%%%%%%%%%%% ASYNC DATA", url);
        await store.dispatch('LOCALIZATION_FETCH', {ip: ''});

        await store.dispatch('CONTENT_FETCH_ROUTER_OBJECT_AND_CONTENT', {url} );

        return true;

    },

}
</script>