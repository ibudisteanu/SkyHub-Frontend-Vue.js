<template>

    <Layout>

        <div slot="content">

            <network/>

        </div>

    </Layout>

</template>

<script>

    import Layout from "client/components/layout/sampleLayout.vue"

    import network from "client/components/heros/network.hero.vue"


    export default {

        name: "ViewHome",

        components:{
            "Layout": Layout,
            "network": network,

        }

    }

</script>