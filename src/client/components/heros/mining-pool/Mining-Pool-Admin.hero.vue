<template>

    <div>

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

            <pool-link-generator></pool-link-generator>

            <pool-miners-list></pool-miners-list>

        </div>

    </div>
    
</template>

<script>

    import Vue from 'vue/dist/vue';

    import PoolMinersList from  "./components/Pool-Miners-List.vue"
    import PoolSettings from  "./components/Pool-Settings.vue"
    import PoolLinkGenerator from "./components/Pool-Link-Generator.vue"

    export default{

        components: { PoolMinersList, PoolSettings, PoolLinkGenerator },

        methods: {


        },

        mounted() {

            if (typeof window === 'undefined') return;


            Vue.use(Clipboard);

        }

    }

</script>

