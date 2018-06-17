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
                                <p class="copyPoolLink">Create Your Own Pool</p>
                            </router-link>

                            <div class="dataStatisticsItem" v-for="(poolServer, index) in this.poolServers">
                                <span class="titlePool serverPool" >{{poolServer.name}}</span>
                                <span class="minerData serverPoolStatus" >{{poolServer.connected ? 'connected - '  + (poolServer.established ? 'established' : 'not established' )  : 'not connected'}} </span>
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

        name: 'miner-pool',

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
                    poolStatus: '',
                    poolMinerNumber: 0
                },

                minerPoolReward: 0,

            }
        },

        components:{PoolStatistics},

        methods: {

            copyToClipboard(){
                this.$clipboard(this.statistics.poolURL);
            },

            loadPoolData(){

                if ( WebDollar.Blockchain.MinerPoolManagement === undefined){

                    this.statistics.minerPoolStatus = "not initialized";

                } else {

                    if (WebDollar.Blockchain.MinerPoolManagement.minerPoolInitialized) this.statistics.minerPoolStatus = "initialized";
                    if (WebDollar.Blockchain.MinerPoolManagement.minerPoolOpened) this.statistics.minerPoolStatus = "configured";
                    if (WebDollar.Blockchain.MinerPoolManagement.minerPoolStarted) this.statistics.minerPoolStatus = "started";

                    this.statistics.poolFee = Math.floor( WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolFee*100 , 2 );
                    this.statistics.poolURL = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolURL;
                    this.statistics.poolName = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolName;
                    this.statistics.poolWebsite = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolWebsite;

                    let poolServers = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolServers;
                    this.statistics.poolServers = WebDollar.Applications.PoolsUtilsHelper.getPoolServersStatus(poolServers);

                    this.statistics.poolsList = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolsList;

                    let minerPoolFound = false;

                    if (WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.minerPoolActivated){

                        let minerPoolPublicKey = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolPublicKey.toString("hex");

                        for (let poolPublicKey in this.statistics.poolsList){

                            if (poolPublicKey === minerPoolPublicKey){
                                this.statistics.poolsListSelected = this.statistics.poolsList[poolPublicKey].poolName;
                                minerPoolFound = true;
                                break;
                            }

                        }

                    }

                    if (!minerPoolFound)
                        this.statistics.poolsListSelected = 'Pool Mining Disabled';

                }


            }


        },

        mounted() {


            if (typeof window === "undefined") return;

            WebDollar.StatusEvents.on("miner-pool/status", (data) => {

                this.loadPoolData();

            });

            WebDollar.StatusEvents.on("miner-pool/settings",(data)=>{

                this.loadPoolData();

            });

            this.loadPoolData();

        }

    }

</script>
