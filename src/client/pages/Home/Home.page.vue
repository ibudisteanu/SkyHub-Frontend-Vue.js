/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

        <Layout>
            <div slot="layout-content">
                <PageContent>

                </PageContent>
            </div>
        </Layout>

</template>

<script>

    import Layout from 'client/components/Template/Layout/Layout.vue';
    import PageContent from './Content-Pages/PageContent.page.vue';

    export default {

        name: 'HomePage',

        components: { Layout, PageContent },

        async asyncData ({ store,  route: { params: { url }} }) {

            console.log("%%%%%%%%%%%%%%% ASYNC DATA", url);
            await store.dispatch('LOCALIZATION_FETCH', {ip: ''}); //the localization is required...

            await store.dispatch('CONTENT_FETCH_ROUTER_OBJECT_AND_CONTENT', {url} );

            return true;

        },

    }
</script>