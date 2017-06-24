<template>
  <div >

    <LeftSidebar />

    THIS IS BODY

    <div id="page-wrapper" @class="gray-bg" @style="{minHeight: 785}">

      <Header />

      <Content>

        <AuthenticationModal />

      </Content>


    </div>

    <Footer />
    <StickyButtons />

    <RightSidebar />

  </div>
</template>


<script>
    export default {
        name: 'layout-body-view',
        components: { },

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
            fetchComments () {
                this.loading = true
                fetchComments(this.$store, this.item).then(() => {
                    this.loading = false
                })
            }
        }
    }
</script>
