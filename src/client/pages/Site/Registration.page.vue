/**
* Created by Alexandru Ionut Budisteanu - SkyHub on 6/24/2017.
* (C) BIT TECHNOLOGIES
*/

<template>

        <Layout>
            <div slot="layout-content">
                <h1> Login to WebDollar now</h1>

                <RegistrationForm @onSuccess="redirectSuccess" />
            </div>

        </Layout>

</template>

<script>

    import Layout from 'client/components/Template/Layout/Layout.vue';
    import RegistrationForm from 'modules/users/authentication/registration/Registration.form.vue';

    export default {

        name: 'LoginPage',

        components: {
            'Layout':Layout,
            'RegistrationForm':RegistrationForm,
        },

        methods: {
            redirectSuccess(){

                console.log("LOGIN PAGE REDIRECT");

                this.$router.push('/')
            }
        },

        /*
                SEO
         */

        title: 'Register, Sing up to SkyHub Social Network',
        description: 'Register, Sign Up right now to the SkyHub Social Network',

    }
</script>