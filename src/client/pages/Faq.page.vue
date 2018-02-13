<template>

    <layout>

        <div slot="content">

            <faq-hero/>

        </div>

    </layout>

</template>

<script>

    import Layout from "client/components/layout/sampleLayout.vue"
    import FaqHero from "client/components/heros/Faq.hero.vue"


    export default {

        name: "faq-page",

        components:{
            "layout": Layout,
            "faq-hero": FaqHero,

        }

    }

</script>