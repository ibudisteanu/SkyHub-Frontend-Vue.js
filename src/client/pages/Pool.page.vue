<template>

    <div>

        <Layout v-show="!protocolUsedOnMultipleTabs">

            <div slot="content">

                <network-hero/>

            </div>

        </Layout>

        <multiple-tabs v-show="protocolUsedOnMultipleTabs"/>

    </div>

</template>

<script>

    import Layout from "client/components/layout/Layout.vue"
    import NetworkHero from "client/components/heros/Network.hero.vue"

    export default {

        name: "pool-page",

        components:{
            "layout": Layout,
            "network-hero": NetworkHero,
        }

    }

</script>