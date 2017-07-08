/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

    <Layout>
        <div class="row" slot="layout-content">
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

        //async asyncData ({ store,  route: { params: { url }} }) {
        async asyncData ({ store,  route: { params: { a,b,c }} }) {
        //async asyncData ({ store,  route}) {

            //url = store.state.route.fullPath.toString();
            let url = '';
            if (typeof a !== 'undefined') url += '/'+a;
            if (typeof b !== 'undefined') url += '/'+b;
            if (typeof c !== 'undefined') url += '/'+c;

            //let url = route.fullPath.toString();
            if ((typeof url === 'string')&&(url[0]==='/')) url = url.substr(1, url.length);
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@',url);
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@',url);
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@',url);
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@',url);
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@',url);
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@',url);
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@',url);

            console.log("%%%%%%%%%%%%%%% ASYNC DATA", url);
            await store.dispatch('LOCALIZATION_FETCH', {ip: ''}); //the localization is required...

            await store.dispatch('CONTENT_FETCH_ROUTER_OBJECT_AND_CONTENT', {url} );

            return true;

        },

    }
</script>