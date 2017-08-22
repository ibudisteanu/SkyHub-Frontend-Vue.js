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
    import Topic from 'models/Topic/Topic.model';

    function checkPageIndex(a, b){
        if ((b!=='')&&(!isNaN(b))) {
            let pageIndex = parseInt(b);
            let pageType = '';
            if ((a === 'forums'))
                pageType = a;
            return {
                pageIndex: pageIndex,
                pageType: pageType,
            }
        }
        return null;
    }

    export default {

        name: 'HomePage',

        components: { Layout, PageContent },

        //async asyncData ({ store,  route: { params: { url }} }) {
        //  forum-name
        //  forum-name/topic-name
        //  forum-name/topic/3
        //  forum-name/forums/3

        async asyncData ({ store,  route: { params: { a,b, c, d }} }) {

            let pageInfo = {
                pageIndex: 0,
                pageType: '',
            };

            if (checkPageIndex(c,d) !== null){
                pageInfo = checkPageIndex(c,d);
                if (pageInfo.pageIndex !== 0) d = '';
                if (pageInfo.pageType !== '') c = '';
            } else
            if (checkPageIndex(b,c) !== null){
                pageInfo = checkPageIndex(b,c);
                if (pageInfo.pageIndex !== 0) c = '';
                if (pageInfo.pageType !== '') b = '';
            } else
            if (checkPageIndex(a,b) !== null){
                pageInfo = checkPageIndex(a,b);
                if (pageInfo.pageIndex !== 0) b = '';
                if (pageInfo.pageType !== '') a = '';
            }else
            if (checkPageIndex('',a) !== null){
                pageInfo = checkPageIndex('',a);
                if (pageInfo.pageIndex !== 0) a = '';
            }

            console.log(a,b,c,d);

            //url = store.state.route.fullPath.toString();
            let url = '';
            if (typeof a !== 'undefined') url += '/'+a;
            if (typeof b !== 'undefined') url += '/'+b;
            if (typeof c !== 'undefined') url += '/'+c;
            if (typeof d !== 'undefined') url += '/'+d;

            if (url === '/index.htm') url = ''; //forward bug fix

            //let url = route.fullPath.toString();
            if ((typeof url === 'string')&&(url[0]==='/')) url = url.substr(1, url.length);

            console.log("%%%%%%%%%%%%%%% ASYNC DATA", url);
            await store.dispatch('LOCALIZATION_FETCH', {ip: ''}); //the localization is required...

            let pageIndex = pageInfo.pageIndex;
            let pageType = pageInfo.pageType;
            await store.dispatch('CONTENT_FETCH_ROUTER_OBJECT_AND_CONTENT', {url, pageIndex, pageType} );

            return true;

        },

        computed: {
            currentObject() {
                return this.$store.state.content.contentRouter.currentObject.object;
            },

            parentObject(){
                return this.$store.state.content.contentRouter.parentObject.object;
            },
        },

        methods:{

        },

        /*
                        SEO
         */
        title: function() {
            return (this.currentObject !== null)
                ?
                    this.currentObject.title||this.currentObject.name
                :
                    'Home'
        },

        description: function() {
            return (this.currentObject !== null)
                ?
                    this.currentObject.shortDescription||this.currentObject.description||this.title
                :
                null
        },

        keywords: function() {
            return (this.currentObject !== null)
                ?
                this.currentObject.keywords||[]
                :
                null
        },

        author: function(){
            return (this.currentObject !== null)
                ?
                    this.currentObject.authorName||this.currentObject.authorId
                :
                    null
        },

        images: function() {

            if ((this.currentObject === null)||(typeof this.currentObject.attachments === 'undefined')) return null;

            return [Topic.getImage(this.currentObject)];

//            let images = [];
//            for(let i=0; i<this.currentObject.attachments.length; i++){
//            }
        },

        webPageType: function(){
            if (this.currentObject === null) return 'page';

            switch (this.$store.state.content.contentRouter.currentObject.type){
                case 'none':
                    return 'page';
                case 'forum':
                case 'topic':
                    return 'article';
                case 'user':
                    return 'webpage';
            }
        },

    }
</script>