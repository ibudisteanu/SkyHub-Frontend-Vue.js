<template>

    <div id="p2p-network">

        <div id="createPoolSection">

            <div class="">

                <h1 class="alignCenter bigMarginBottom">Miner Pool</h1>

                <h2 class="alignCenter bigMarginBottom">{{this.poolName}}</h2>
                <h3 class="alignCenter bigMarginBottom">{{this.poolWebsite}}</h3>
                <h4 class="alignCenter bigMarginBottom">{{this.poolURL}}</h4>

                <div class="distributionContainer">

                    <div class="distributionGrid">

                        <div class="verticalAlignMiddle">

                            <p class="subtitle">REWARD: {{this.poolReward}}</p>

                            <p class="createPoolLink">{{}this.poolDescription}</p>

                        </div>

                    </div>


                </div>

            </div>

        </div>

    </div>

</template>

<script>

    import Vue from 'vue/dist/vue';

    import slider from '../../../UI/elements/Slider.vue';
    import Clipboard from 'v-clipboard';

    export default{

        name: 'miner-pool',

        data: () => {
            return {
                poolName: '',
                poolWebsite: '',
                poolURL: '',
                poolReward: 0,
                poolDescription: '',

                protocolUsedOnMultipleTabs: false,
            }
        },

        components: {
            "slider":slider
        },

        methods: {

            changeCommission(){

            },

        },

        mounted() {


            if (typeof window === "undefined") return;

            WebDollar.StatusEvents.on("blockchain/status", (data)=>{

                if (data.message === "Single Window")
                    this.protocolUsedOnMultipleTabs= false;
                else
                if (data.message === "Multiple Windows Detected")
                    this.protocolUsedOnMultipleTabs=true;

            });

        }

    }

</script>