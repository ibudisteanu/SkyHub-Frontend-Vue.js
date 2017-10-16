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
    import {sanitizeStripAllTags} from 'modules/utils/global-utilities/SanitizeAdvanced';

    export default {

        name: 'HomePage',

        components: { Layout, PageContent },

        //async asyncData ({ store,  route: { params: { url }} }) {
        //  forum-name
        //  forum-name/topic-name
        //  forum-name/topic/3
        //  forum-name/forums/3
        //  forum-name/all-pages/3

        async asyncData ({ store,  route: { params: { a,b, c, d }} }) {

        },

        computed: {

        },

        methods:{

        },

        /*
                        SEO
         */

    }
</script>