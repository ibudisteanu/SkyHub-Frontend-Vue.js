<template>

    <div>

        <layout v-show="!protocolUsedOnMultipleTabs">

            <div slot="content">

                <webdollar-hero/>

                <what-is-hero/>

                <peer-to-peer-hero/>

                <new-crypto-generation-hero/>

                <blockchain-distribution-hero/>

                <timeline-hero/>

                <team-hero/>

                <know-us--hero/>

            </div>

        </layout>

        <multiple-tabs v-show="protocolUsedOnMultipleTabs"/>

    </div>

</template>

<script>

    import Layout from "client/components/layout/Layout.vue";

    import TeamHero from "client/components/heros/Team.hero.vue";
    import WebDollarHero from "client/components/heros/WebDollar.hero.vue";
    import WhatIsHero from "client/components/heros/What-Is.hero.vue";
    import PeerToPeerHero from "client/components/heros/Peer-To-Peer.hero.vue";
    import TimelineHero from "client/components/heros/Timeline.hero.vue";
    import KnowUsHero from "client/components/heros/Know-Us.hero.vue";
    import FaqHero from "client/components/heros/Faq.hero.vue";
    import NewCryptoGenerationHero from "client/components/heros/New-Crypto-Generation.hero.vue";
    import BlockChainDistributionHero from "client/components/heros/Blockchain-Distribution.hero.vue";
    import WebdollarHero from "../components/heros/WebDollar.hero.vue";
    import MultipleTabs from "../components/heros/Multiple-Tabs.hero.vue";

    export default {

        name: "ViewHome",

        components:{
            "layout": Layout,
            "team-hero": TeamHero,
            "webdollar-hero": WebDollarHero,
            "what-is-hero": WhatIsHero,
            "peer-to-peer-hero": PeerToPeerHero,
            "timeline-hero": TimelineHero,
            "know-us-hero": KnowUsHero,
            "faq-hero": FaqHero,
            "new-crypto-generation-hero":NewCryptoGenerationHero,
            "blockchain-distribution-hero":BlockChainDistributionHero,
            "MultipleTabs":MultipleTabs
        },

        data: () => {
            return {
                protocolUsedOnMultipleTabs: false
            }
        },

        mounted(){

            WebDollar.StatusEvents.on("blockchain/status-webdollar", (data)=>{

                if (data.message === "Single Window") {

                    this.protocolUsedOnMultipleTabs= false;

                }else
                if (data.message === "Multiple Windows Detected"){

                    this.protocolUsedOnMultipleTabs=true;

                }

            });

        }

    }

</script>