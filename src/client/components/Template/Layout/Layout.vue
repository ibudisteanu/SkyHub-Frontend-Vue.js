<template>

        <div id="wrapper">

            {{this.checkAuthenticatedUser}}

            <LayoutBody>

                <div slot="content">
                    <slot name="layout-content" />

                </div>

            </LayoutBody>


            <LayoutFooter />

            <StickyButtons />

            <RightSidebar />

            <AuthenticationModal modalId="authenticationModal" ref="refAuthenticationModal"/>

        </div>


</template>

<script>

    import LayoutBody from '../Template-components/Body/LayoutBody.vue'
    import LayoutFooter from '../Template-components/Footer/LayoutFooter.vue';
    import StickyButtons from '../Template-components/Body/Sticky-buttons/StickyButtons.vue';
    import RightSidebar from '../Template-components/Body/Right-sidebar/RightSidebar.vue';

    import AuthenticationModal from 'modules/users/authentication/modals/Authentication.modal.vue';

    import User from "models/User/User.model";
    import Reply from "models/Reply/Reply.model";

    export default {
        name: 'Layout',
        components: {
            'LayoutBody': LayoutBody ,
            'LayoutFooter': LayoutFooter,
            'StickyButtons': StickyButtons,
            'RightSidebar': RightSidebar,
            'AuthenticationModal': AuthenticationModal,

        },

        data: function() {

            return {
                loading: true,
            }},

        created: function (){

//            var self = this;
//            setInterval(self.time, 1000);
//            self.time();

        },

        mounted: function (){
            this.$store.dispatch('GLOBAL_NEW_AUTHENTICATION_MODAL', {refAuthenticationModal: this.$refs['refAuthenticationModal']})
        },



        computed: {

            notAuthenticated(){
                return !this.$store.getters.isUserLoggedIn;
            },

            checkAuthenticatedUser(){

                console.log("layout trying...");

                if (typeof window !== "undefined")
                    if (this.$store.getters.isUserLoggedIn)
                        document.body.className = document.body.className.replace("mini-navbar top-navigation","");
                    else {
                        if (document.body.className.indexOf("mini-navbar top-navigation") < 0)
                            document.body.className += " mini-navbar top-navigation ";
                    }

                console.log("layout finished...");

                return '';
            },

        },

        // We only fetch the item itself before entering the view, because
        // it might take a long time to load threads with hundreds of comments
        // due to how the HN Firebase API works.
        asyncData ({ store, route: { params: { id }}}) {

            //voi incarca datele, fetch

            //store.dispatch('FETCH_USER',{id:'user'});
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
            time() {
                console.log("TEEST",typeof window);
            },

            openModal(){
                this.$refs['refAuthenticationModal'].openLogin();

            }
        }
    }

</script>


