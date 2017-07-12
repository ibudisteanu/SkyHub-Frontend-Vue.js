/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/24/2017.
 * (C) BIT TECHNOLOGIES
 */


<template>

    <Layout>
        <div slot="layout-content">
            "About Skyhub"
        </div>
    </Layout>

</template>

<script>

    import Layout from 'client/components/Template/Layout/Layout.vue';

    export default {

        name: 'About',

        components: { Layout },


        /*
                SEO
         */

        title: 'About SkyHub Social Network',
        description: 'SkyHub is a disruptive new kind of social network that allows the people to connect and change the world together',

    }
</script>