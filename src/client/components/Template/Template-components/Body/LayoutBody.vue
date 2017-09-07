<template>
  <div >

    <div v-if="isLoggedIn">
      <LeftSidebar  />
    </div>


    <div id="page-wrapper" class="gray-bg" :style="{minHeight: '785px'}">

      <LayoutHeader />

      <slot name="content" />


    </div>



  </div>
</template>


<script>

    import LeftSidebar from './Left-sidebar/LeftSidebar.vue';
    import LayoutHeader from '../Header/LayoutHeader.vue';

    export default {
        name: 'layout-body-view',
        components: { LeftSidebar, LayoutHeader },

        data: () => ({
            loading: true
        }),

        computed: {
            isLoggedIn(){
                return this.$store.getters.isAuthenticatedUserLoggedIn;
            }
        },

        // We only fetch the item itself before entering the view, because
        // it might take a long time to load threads with hundreds of comments
        // due to how the HN Firebase API works.
        asyncData ({ store, route: { params: { id }}}) {
            //return store.dispatch('FETCH_ITEMS', { ids: [id] })
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
