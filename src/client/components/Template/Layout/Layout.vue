<template>
    <div id="wrapper">


        <Body/>

        <Footer />
        <StickyButtons />

        <RightSidebar />

    </div>
</template>

<script>

    import Body from '../Template-components/Body/Body.vue'
    import Footer from '../Template-components/Footer/Footer.vue';


    export default {
        name: 'layout-view',
        components: { Body , Footer},

        data: () => ({
            loading: true
        }),

        computed: {

        },

        // We only fetch the item itself before entering the view, because
        // it might take a long time to load threads with hundreds of comments
        // due to how the HN Firebase API works.
        asyncData ({ store, route: { params: { id }}}) {
            //return store.dispatch('FETCH_ITEMS', { ids: [id] })
        },

        title () {
            return 'HELLO WORLD'
        },

        // Fetch comments when mounted on the client
        beforeMount () {
            //this.fetchComments()
        },

        // refetch comments if item changed
        watch: {
            //item: 'fetchComments'
        },

        methods: {

        }
    }

</script>


