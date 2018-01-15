<template>

    <Layout>

        <div slot="content">

            <faq/>

        </div>

    </Layout>

</template>

<script>

    import Layout from "client/components/layout/sampleLayout.vue"
    import faq from "client/components/heros/faq.hero.vue"


    export default {

        name: "faqPage",

        components:{
            "Layout": Layout,
            "faq": faq,

        }

    }

</script>