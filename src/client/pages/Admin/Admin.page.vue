/**
* Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
* (C) BIT TECHNOLOGIES
*/

<template>

    <Layout>
        <div class="row" slot="layout-content">

            <div v-if="!isLoggedIn || !isAdmin">

                <div class="alert alert-danger alert-dismissable">
                    <div v-if="!isLoggedIn">
                        You are not logged in!
                    </div>
                    <div v-else-if="!isAdmin">
                        You are not Admin!
                    </div>
                </div>

            </div>
            <div v-else>

            </div>
        </div>
    </Layout>

</template>

<script>

    import Layout from 'client/components/Template/Layout/Layout.vue';
    import {sanitizeStripAllTags} from 'modules/utils/global-utilities/SanitizeAdvanced';


    export default {

        name: 'AdminPage',

        components: { Layout },

        computed:{
            isLoggedIn(){
                return this.$store.getters.isAuthenticatedUserLoggedIn;
            },

            isAdmin(){
                return this.$store.getters.isAuthenticatedUserAdmin;
            },
        },

        methods:{

        },



    }
</script>