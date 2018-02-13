<template>

    <Layout>

        <div slot="content">

            <network-hero/>

        </div>

    </Layout>

</template>

<script>

    import Layout from "client/components/layout/sampleLayout.vue"
    import NetworkHero from "client/components/heros/Network.hero.vue"


    export default {

        name: "pool-page",

        components:{
            "layout": Layout,
            "network-hero": NetworkHero,

        }

    }

</script>