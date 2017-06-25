<template>

        <div id="wrapper">

            {{authenticatedUser}}

            <LayoutBody>

                <div slot="content">
                    <slot name="layout-content" />
                    <b>TEST LAYOUT</b>

                    <button @click="openModal"> Open Modal</button>
                    <view-reply :reply ="reply" title="titlu mesaj"
                    >
                    </view-reply>
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

    import ViewReply from  'modules/forums/replies/view-reply/ViewReply.component.vue'

    export default {
        name: 'Layout',
        components: { LayoutBody , LayoutFooter, StickyButtons, RightSidebar, AuthenticationModal,ViewReply},

        data: () => ({
            loading: true,
            reply : ( new Reply( {
                id :22, title:"nume titlu",topicId : 244, replyParentId : 323, votingId : 21441, authorId : 2414, description : "fk3kkfeac"
            })
//            new User ( {id : 22,
//                firstName : "testing nume",
//                lastName : "nume final",
//                email: "ifeaviea@gea3.com",
//                username : "userX",
//                loggedIn : "19-15-2016"}
                ),
        }),

        created: function (){

//            var self = this;
//            setInterval(self.time, 1000);
//            self.time();

        },

        mounted: function (){
            this.$store.dispatch('GLOBAL_NEW_AUTHENTICATION_MODAL', {refAuthenticationModal: this.$refs['refAuthenticationModal']})
        },

        computed: {



            getBodyClass(){
                if (User.isLoggedIn(this.$store.state.authenticatedUser.user))
                    return "pace-done";
                else
                    return "pace-done mini-navbar top-navigation"
            },

            authenticatedUser(){

                console.log("trying...");

                if (typeof window !== "undefined")
                    if (User.isLoggedIn(this.$store.state.authenticatedUser.user))
                        document.body.className = document.body.className.replace("mini-navbar top-navigation","");
                    else {
                        if (document.body.className.indexOf("mini-navbar top-navigation") < 0)
                            document.body.className += " mini-navbar top-navigation ";
                    }

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
            time() {
                console.log("TEEST",typeof window);
            },

            openModal(){
                this.$refs['refAuthenticationModal'].openLogin();

            }
        }
    }

</script>


