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

    async asyncData ({ store }) {

        console.log('xxxxxxxxx ASYNC DATA HOMEPAGE ');
        return await store.dispatch('LOCALIZATION_FETCH', {ip: ''});
    },

}
</script>