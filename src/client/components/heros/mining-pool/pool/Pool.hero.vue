<template>

    <div id="p2p-network">

        <div id="createPoolSection">

            <h1 class="alignCenter bigMarginBottom">POOL Mining</h1>

            <div class="distributionContainer">

                <div class="distributionGrid borderBottom">
                    <h2 class="subtitle">Pool Quick Command</h2>
                </div>
                <div class="distributionGrid borderBottom">
                    <h2 class="subtitle">Pool Statistics</h2>
                </div>

                <div class="distributionGrid">

                    <div class="verticalAlignMiddle">

                        <div class="twoButtons">

                            <router-link to="/mypool">
                                <p class="copyPoolLink">Pool Dashboard</p>
                            </router-link>

                            <p class="copyPoolLink" v-show="this.poolURL !== ''" @click="copyToClipboard">
                                Copy invite link
                            </p>

                        </div>

                    </div>

                </div>

                <pool-statistics :statistics="this.statistics"></pool-statistics>

            </div>

        </div>

    </div>

</template>

<script>

    import Vue from 'vue';
    import Clipboard from 'v-clipboard';
    import PoolStatistics from '../pool/components/PoolInfo.vue'

    Vue.use(Clipboard);

    export default{

        name: 'pool',

        components:{PoolStatistics},

        data: () => {
            return {

                statistics:{
                    poolName: '',
                    poolWebsite: '',
                    poolURL: '',
                    poolFee: '',
                    poolServers: {},
                    poolsList: {},
                    poolsListSelected: '',
                    poolHash: 0,
                    poolStatus: '',
                    poolMinerNumber: 0
                },
            }
        },

        methods: {

            async handleChangePoolFee(fee){

                this.statistics.poolFee = fee;

                if (WebDollar.Blockchain.PoolManagement !== undefined)
                    await WebDollar.Blockchain.PoolManagement.poolSettings.setPoolFee(this.statistics.poolFee/100);
            },

            copyToClipboard(){
                this.$clipboard(this.poolURL);
            },

            loadPoolData(){

                if (WebDollar.Blockchain.PoolManagement === undefined){

                    this.statistics.poolStatus = "not initialized";

                } else {

                    if (WebDollar.Blockchain.PoolManagement.poolInitialized) this.statistics.poolStatus = "Initialized";
                    if (WebDollar.Blockchain.PoolManagement.poolOpened) this.statistics.poolStatus = "Configured";
                    if (WebDollar.Blockchain.PoolManagement.poolStarted) this.statistics.poolStatus = "Started";

                    let poolServers = WebDollar.Blockchain.PoolManagement.poolSettings.poolServers;
                    this.statistics.poolServers = WebDollar.Applications.PoolsUtilsHelper.getPoolServersStatus(poolServers);

                    this.poolURL = WebDollar.Blockchain.PoolManagement.poolSettings.poolURL;

                    this.statistics.poolFee = Math.floor( WebDollar.Blockchain.PoolManagement.poolSettings.poolFee*100 , 2 );
                    if (this.$refs['refPoolFee'] !== undefined)
                        this.$refs['refPoolFee'].value = this.statistics.poolFee;


                }


            }

        },

        mounted() {

            if (typeof window === 'undefined') return;

            WebDollar.StatusEvents.on("pools/status", (data) => {

                this.loadPoolData();

            });

            WebDollar.StatusEvents.on("pools/settings",(data)=>{

                this.loadPoolData();

            });

            this.loadPoolData();

        }

    }

</script>

<style>

    .serverPool{
        display: inline;
        padding-right: 20px ;
    }

    .serverPoolStatus{
        display: inline;
    }

    .twoButtons{
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

</style>