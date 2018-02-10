<template>

    <Layout>

        <div slot="content">

            <WebDollarHero/>

            <WhatIsHero/>

            <PeerToPeerHero />

            <newCryptoGeneration/>

            <blockChainDistribution/>

            <TimelineHero/>

            <TeamHero/>

            <knowUs/>

        </div>

    </Layout>

</template>

<script>

    import Layout from "client/components/layout/Layout.vue"

    import TeamHero from "client/components/heros/Team.hero.vue"
    import WebDollarHero from "client/components/heros/WebDollar.hero.vue"
    import WhatIsHero from "client/components/heros/WhatIs.hero.vue"
    import PeerToPeerHero from "client/components/heros/PeerToPeer.hero.vue"
    import TimelineHero from "client/components/heros/Timeline.hero.vue"
    import knowUs from "client/components/heros/knowUs.hero.vue"
    import faq from "client/components/heros/faq.hero.vue"
    import newCryptoGeneration from "client/components/heros/NewCryptoGeneration.hero.vue"
    import blockChainDistribution from "client/components/heros/BlockChainDistribution.hero.vue"

    export default {

        name: "ViewHome",

        components:{
            "Layout": Layout,
            "TeamHero": TeamHero,
            "WebDollarHero": WebDollarHero,
            "WhatIsHero": WhatIsHero,
            "PeerToPeerHero": PeerToPeerHero,
            "TimelineHero": TimelineHero,
            "knowUs": knowUs,
            "faq": faq,
            "newCryptoGeneration":newCryptoGeneration,
            "blockChainDistribution":blockChainDistribution,
        }

    }

</script>