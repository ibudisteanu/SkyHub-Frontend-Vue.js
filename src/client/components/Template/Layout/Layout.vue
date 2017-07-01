<template>

        <div id="wrapper">

            {{this.checkAuthenticatedUser}}

            <LayoutBody>

                <div slot="content">
                    <slot name="layout-content" />
                    <b>TEST LAYOUT</b>

                    <button @click="openModal"> Open Modal</button>

                    <ViewAllReplies
                        :repliesList = "repliesList"

                        parentReplyId = "1"
                        key = 'ViewReplies_'

                    >
                    </ViewAllReplies>

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

    import ViewAllReplies from  'modules/forums/replies/view-reply/ViewAllReplies.vue'
    import Voting from  'modules/forums/voting/Voting.component.vue'


    export default {
        name: 'Layout',
        components: {
            'LayoutBody': LayoutBody ,
            'LayoutFooter': LayoutFooter,
            'StickyButtons': StickyButtons,
            'RightSidebar': RightSidebar,
            'AuthenticationModal': AuthenticationModal,
            'Voting': Voting ,
            'ViewAllReplies': ViewAllReplies,
        },

        data: function() {
            let reply1  = new Reply( {
                id :1, title:"nume titlu1",topicId : 244, parentReplyId : "", votingId : 21441, authorId : 2414, description : "fk3kkfeac"
            });

            let reply2  = new Reply( {
                id :2, title:"nume titlu 2",topicId : 244, parentReplyId : "1", votingId : 21441, authorId : 2414, description : "fk3kkfeac"
            });

            let reply3  = new Reply( {
                id :3, title:"nume titlu 3",topicId : 244, parentReplyId : "1", votingId : 21441, authorId : 2414, description : "fk3kkfeac"
            });

            let reply3_3  = new Reply( {
                id :33, title:"nume titlu 3",topicId : 244, parentReplyId : "3", votingId : 21441, authorId : 2414, description : "fk3kkfeac"
            });

            let reply4  = new Reply( {
                id :4, title:"nume titlu 4",topicId : 244, parentReplyId : "4", votingId : 21441, authorId : 2414, description : "fk3kkfeac"
            });

            return {
                loading: true,
                repliesList: [reply1, reply2,reply3,reply4, reply3_3  ]
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
                return !User.isLoggedIn(this.$store.state.authenticatedUser.user);
            },

            checkAuthenticatedUser(){

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


