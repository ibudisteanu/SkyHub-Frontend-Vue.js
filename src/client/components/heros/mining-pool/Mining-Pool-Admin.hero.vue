<template>

    <div>

        <div id="miningPoolController">

            <div class="generalController">

                <pool-settings></pool-settings>

            </div>

            <h2>Selected miner statistics</h2>

            <div class="selectedMinerInfo">

                <p>
                    <span class="titlePool">Pool address:</span>
                    <span class="minerData address">{{this.poolLeader.address}}</span>
                </p>

                <p>
                    <span class="titlePool">Display Type:</span>
                    <span class="minerData buttonSmall" @click="changeDisplayType('list')" :class="this.displayType === 'list' ? 'selected' : ''">LIST</span>
                    <span class="minerData buttonSmall" @click="changeDisplayType('normal')"  :class="this.displayType === 'normal' ? 'selected' : ''">NORMAL</span>
                </p>

                <p>
                    <span class="titlePool">Your Reward for next block:</span>
                    <span class="minerData">600 WEBD</span>
                </p>

                <p>
                    <span class="titlePool">Miners Reward for next block:</span>
                    <span class="minerData">5400 WEBD</span>
                </p>

            </div>

        </div>

        <div id="yourPoolSection">

            <pool-miners-list :displayType="this.displayType"></pool-miners-list>

        </div>

    </div>
    
</template>

<script>

    import Vue from 'vue/dist/vue';

    import PoolMinersList from  "./components/Pool-Miners-List.vue"
    import PoolSettings from  "./components/Pool-Settings.vue"

    export default{

        components: { PoolMinersList, PoolSettings },

        data: () => {
            return {
                displayType: 'list',
                poolLeader:{
                    address: 'WEBD$gCPE#0MUG@ReQk3wD7EB5vmMGDdo#YhHSr$',
                    poolLeaderCommission: 20
                },
            }
        },

        methods: {

            changeDisplayType(type){
                this.displayType=type;
            },

        },

        mounted() {

            if (typeof window === 'undefined') return;


            Vue.use(Clipboard);

        }

    }

</script>

