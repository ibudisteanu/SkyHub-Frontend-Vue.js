<template>

    <div id="mainSection" class="fullSection">
        <div class="verticalAlignMiddle alignCenter modifyTop verticalAlignMiddleMobileFix">

            <img src="/public/WebDollar-logo-white.png" class="mainLogo fadeIn">

            <h1 class="fadeIn fadeIn2">WebDollar <b class="testnet">TEST NET# 3.2</b></h1>
            <h2 v-show="this.maintenance" class="fadeIn fadeIn2"><b class="testnet">UNDER MAINTENANCE</b></h2>
            <h3 class="fadeIn fadeIn3" :style="{marginTop: !this.mainNet ? '0': '30px'}">Currency of the Internet</h3>

            <div v-show="this.mainNet">
                <h5 class="fadeIn fadeIn4">{{this.status}}</h5>
                <div class='btn-cont btnPosition fadeIn fadeIn5'> </div>

                <h5 class="fadeIn fadeIn3" v-if="this.loaded === false">
                    <span class="alreadyMining">You are already mining...</span>
                    <loading-spinner />
                </h5>

                <div class='btn-cont btnPosition fadeIn fadeIn4'>
                    <a class='btn' href="#p2p-network">
                        See your Network
                        <span class='line-1'></span>
                        <span class='line-2'></span>
                        <span class='line-3'></span>
                        <span class='line-4'></span>
                    </a>
                </div>
            </div>

            <div class="fadeIn fadeIn3" v-show="!this.mainNet">
                <!--<countdown end="April 1, 2018" /> -->
            </div>

        </div>
    </div>

</template>

<script>

    import Countdown from 'vuejs-countdown';
    import LoadingSpinner from "client/components/UI/elements/Loading-Spinner.vue"

    export default{

        name: "WebDollarHero",

        components: {
            Countdown,
            LoadingSpinner,
        },

        data: ()=>{
            return {
                status: 'Starting...',
                loaded: false,
                maintenance: false,
                mainNet: true
            }
        },

        mounted(){

            if (typeof window === "undefined") return;

            if (process.env.NODE_ENV === 'development')
                WebDollarUserInterface.initializeParams.mining.startAutomatically = false;

            WebDollar.StatusEvents.on("blockchain/status", (data)=>{
                this.status = data.message;
            });

            WebDollar.StatusEvents.on("agent/status", (data)=>{

                if ( !this.loaded )
                    this.status = data.message + " " + data.blockHeight + " / " + (data.blockHeightMax-1);

            });

            WebDollar.StatusEvents.emitter.on("blockchain/status", (data)=>{

                if (data.message === "Blockchain Ready to Mine")
                    this.loaded = true;

            });

        }

    }

</script>