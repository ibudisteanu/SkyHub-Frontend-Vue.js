<template>
    <body :class="getBodyClass">
        <div id="wrapper">

            <LayoutBody>

                <div slot="content">
                    <b>TEST LAYOUT</b>
                </div>

            </LayoutBody>


            <LayoutFooter />

            <StickyButtons />

            <RightSidebar />

        </div>
    </body>

</template>

<script>

    import LayoutBody from '../Template-components/Body/LayoutBody.vue'
    import LayoutFooter from '../Template-components/Footer/LayoutFooter.vue';

    import User from 'models/User/User.model';

    export default {
        name: 'layout-view',
        components: { LayoutBody , LayoutFooter},

        data: () => ({
            loading: true
        }),

        computed: {
            getBodyClass(){
                if (User.isLoggedIn(this.$store.state.authenticatedUser.user))
                    return "pace-done";
                else
                    return "pace-done mini-navbar top-navigation";
            }
        },

        // We only fetch the item itself before entering the view, because
        // it might take a long time to load threads with hundreds of comments
        // due to how the HN Firebase API works.
        asyncData ({ store, route: { params: { id }}}) {

            //voi incarca datele, fetch

            //store.dispatch('FETCH_USER',{id:'user'});
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


