<template>

    <div>

        <layout v-show="!protocolUsedOnMultipleTabs">

            <div slot="content">

                <web-dollar-hero/>

                <what-is-hero/>

                <peer-to-peer-hero/>

                <newsletter-hero/>

                <miner-pool-hero v-show="!poolActivated"/>

                <pool-hero v-show="poolActivated"/>

                <new-crypto-generation-hero/>

                <blockchain-distribution-hero/>

                <timeline-hero/>

                <team-hero/>

                <know-us-hero/>

            </div>

        </layout>

        <multiple-tabs v-show="protocolUsedOnMultipleTabs"/>

    </div>

</template>

<script>

    import Layout from "client/components/layout/Layout.vue";

    import PoolHero from "client/components/heros/mining-pool/pool/Pool.hero.vue";
    import MinerPoolHero from "client/components/heros/mining-pool/miner-pool/Miner-Pool.hero.vue";
    import NewsletterHero from "client/components/heros/Newsletter.hero.vue";
    import TeamHero from "client/components/heros/Team.hero.vue";
    import WebDollarHero from "client/components/heros/WebDollar.hero.vue";
    import WhatIsHero from "client/components/heros/About.hero.vue";
    import PeerToPeerHero from "client/components/heros/Peer-To-Peer.hero.vue";
    import TimelineHero from "client/components/heros/Timeline.hero.vue";
    import KnowUsHero from "client/components/heros/Media.hero.vue";
    import FaqHero from "client/components/heros/Faq.hero.vue";
    import NewCryptoGenerationHero from "client/components/heros/Features.hero.vue";
    import BlockchainDistributionHero from "client/components/heros/Blockchain-Distribution.hero.vue";
    import MultipleTabs from "../components/heros/Multiple-Tabs.hero.vue";

    export default {

        name: "ViewHome",

        components:{
            Layout,
            TeamHero,
            WebDollarHero,
            WhatIsHero,
            PeerToPeerHero,
            TimelineHero,
            KnowUsHero,
            FaqHero,
            NewCryptoGenerationHero,
            BlockchainDistributionHero,
            PoolHero,
            MinerPoolHero,
            MultipleTabs,
            NewsletterHero,
        },

        data: () => {
            return {
                protocolUsedOnMultipleTabs: false,
                poolActivated: true,
            }
        },

        mounted(){

            if (typeof window === "undefined") return false;

            WebDollar.StatusEvents.on("blockchain/status", (data)=>{

                if (data.message === "Single Window") {

                    this.protocolUsedOnMultipleTabs= false;

                }else
                if (data.message === "Multiple Windows Detected"){

                    this.protocolUsedOnMultipleTabs=true;

                }

            });

            this.initializePool();

            WebDollar.StatusEvents.on("blockchain/logs", (data)=> {

                switch (data.message) {

                    case "Network Adjusted Time Error":

                        setTimeout(()=>{
                            location.reload();
                        }, 12022*1000);

                        break;

                    case "You mined way too many blocks":

                        setTimeout(()=>{
                            location.reload();
                        }, 15*1000);

                        break;
                }

            });


            this.loadPoolSettings();

        },

        methods:{

            async initializePool(){
                
                if (this.$store.state.route.params.a !== "pool" || this.$store.state.route.params['0'].length < 5 ) {
                    return false;
                }

                WebDollar.StatusEvents.on("main-pools/status", async (data)=> {

                    if (data.message === "Pool Initialized") {

                        await WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.setPoolURL(this.$store.state.route.params['0']);
                        await WebDollar.Blockchain.MinerPoolManagement.setMinerPoolStarted(true, true);

                        console.log(this.$store.state.route.params['0']);
                    }

                });

            },

            loadPoolSettings(){

                if (WebDollar.Blockchain.PoolManagement !== undefined && WebDollar.Blockchain.PoolManagement.poolStarted) this.poolActivated = true;
                else if (WebDollar.Blockchain.MinerPoolManagement !== undefined && WebDollar.Blockchain.MinerPoolManagement.minerPoolStarted) this.poolActivated = false;
                else this.poolActivated = false;

                WebDollar.StatusEvents.on("miner-pool/status", (data) => {

                    if (data.message === "Miner Pool Started changed")
                        this.poolActivated = !data.result;

                });

                WebDollar.StatusEvents.on("pools/status", (data) => {

                    if (data.message === "Pool Started changed")
                        this.poolActivated = data.result;

                });

            }

        },

        async asyncData ({ store,  route: { params: { a,b, c, d, e, f }} }) {

            return true;

        },


    }

</script>
