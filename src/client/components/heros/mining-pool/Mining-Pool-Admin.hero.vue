<template>

    <Div>

        <div id="miningPoolController">

            <div class="generalController">

                <pool-settings></pool-settings>

            </div>

            <h2>Selected miner statistics</h2>

            <div class="selectedMinerInfo">

                <p>Address: <span class="minerData">43t1431hg2qfwwqDSADSAD</span></p>

                <p>Miner reward for today: <span class="minerData">24 WEBD</span></p>

                <p>Miner reward from your pool: <span class="minerData">512 WEBD</span></p>

                <p>Total hours mined: <span class="minerData">24h</span></p>

                <p>Arability mining percentage: <span class="minerData">90%</span></p>

                <p>Mining power: <span class="minerData">5 Threads</span></p>

                <p>Hash/s: <span class="minerData">~ 800</span></p>

            </div>

        </div>

        <div id="yourPoolSection">

            <div class="poolSectionContainer">

                <span class="disclaimer"><span class="attention">ATTENTION!</span> This page is just a mock up for mining pool management system.</span>

                <pool-miners-list></pool-miners-list>

                <pool-link-generator></pool-link-generator>

            </div>

        </div>

    </Div>
    
</template>

<script>

    import Vue from 'vue/dist/vue';

    import Clipboard from 'v-clipboard';

    import PoolMinersList from  "./components/Pool-Miners-List.vue"
    import PoolSettings from  "./components/Pool-Settings.vue"
    import PoolLinkGenerator from "./components/Pool-Link-Generator.vue"

    export default{

        components: { PoolMinersList, PoolSettings, PoolLinkGenerator },

        methods: {

            copyToClipboard(){
                this.$clipboard('test-link');
            }

        },

        mounted() {

            if (typeof window === 'undefined') return;


            Vue.use(Clipboard);

        }

    }

</script>

