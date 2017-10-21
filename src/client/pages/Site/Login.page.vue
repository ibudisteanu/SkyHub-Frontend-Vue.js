/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/24/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

        <Layout>
            <div slot="layout-content">
                <h1> Login to WebDollar now</h1>

                <LoginForm @onSuccess="redirectSuccess" />
            </div>

        </Layout>

</template>

<script>

    import Layout from 'client/components/Template/Layout/Layout.vue';
    import LoginForm from 'modules/users/authentication/login/Login.form.vue';

    export default {

        name: 'LoginPage',

        components: {
            'Layout':Layout,
            'LoginForm':LoginForm,
        },

        methods: {
            redirectSuccess(){

                console.log("LOGIN PAGE REDIRECT");

                //window.location.href = "/";
                //this.$router.back();
                this.$router.push('/')
            }
        },

        /*
            SEO
         */

        title: 'Login, Sign In to SkyHub Social Network',
        description: 'Login, Sign In right now to the SkyHub Social Network',

    }
</script>