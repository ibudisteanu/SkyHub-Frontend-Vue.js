<template>

    <Layout>

        <div slot="content">

            <WebDollarHero/>

            <WhatIsHero/>

            <PeerToPeerHero />

            <TimelineHero/>

            <TeamHero/>

            <!--<Wallets />-->

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

    import Wallets from "client/components/Wallet/Wallets.vue"

    export default {

        name: "ViewHome",

        components:{
            "Layout": Layout,
            "TeamHero": TeamHero,
            "WebDollarHero": WebDollarHero,
            "WhatIsHero": WhatIsHero,
            "PeerToPeerHero": PeerToPeerHero,
            "TimelineHero": TimelineHero,
            "Wallets": Wallets,
        }

    }

</script>