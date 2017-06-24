/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/24/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

     <Layout>

        <h1> Login to SkyHub now</h1>

         <LoginForm/>

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

    }
</script>