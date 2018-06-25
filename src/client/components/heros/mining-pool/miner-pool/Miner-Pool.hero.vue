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

                        <div class="">

                            <router-link to="/mypool">
                                <p class="copyPoolLink">Create Your Own Pool</p>
                            </router-link>

                        </div>

                    </div>

                </div>

                <pool-statistics :poolName="poolName" :poolWebsite="poolWebsite" :poolURL="poolURL" :poolFee="poolFee" :poolServers="poolServers" :poolsList="poolsList" :poolsListSelected="poolsListSelected" :poolStatus="minerPoolStatus" :poolHashes="poolHashes" :poolMinersOnline="poolMinersOnline" :poolBlocksConfirmed="poolBlocksConfirmed" :poolBlocksUnconfirmed="poolBlocksUnconfirmed" :poolTimeRemaining="poolTimeRemaining" > </pool-statistics>

            </div>

        </div>

    </div>

</template>

<script>

    import Vue from 'vue';
    import Clipboard from 'v-clipboard';
    import PoolStatistics from '../pool/components/Pool-Statistics.vue'

    Vue.use(Clipboard);

    export default{

        name: 'miner-pool',

        data: () => {
            return {

                poolName: '',
                poolWebsite: '',
                poolURL: '',
                poolFee: '',
                poolServers: {},
                poolsList: {},
                poolsListSelected: '',
                minerPoolStatus: '',

                poolHashes: 0,
                poolMinersOnline: 0,
                poolBlocksConfirmed: 0,
                poolBlocksUnconfirmed: 0,
                poolTimeRemaining: 0,

                subscribedMinerPoolStatistics:false,

            }
        },

        components:{PoolStatistics},

        methods: {

            copyToClipboard(){
                this.$clipboard(this.poolURL);
            },

            loadPoolData(){

                if ( WebDollar.Blockchain.MinerPoolManagement === undefined){

                    this.minerPoolStatus = "not initialized";

                } else {

                    if (WebDollar.Blockchain.MinerPoolManagement.minerPoolInitialized) this.minerPoolStatus = "initialized";
                    if (WebDollar.Blockchain.MinerPoolManagement.minerPoolOpened) this.minerPoolStatus = "configured";
                    if (WebDollar.Blockchain.MinerPoolManagement.minerPoolStarted) this.minerPoolStatus = "started";

                    this.poolFee = Math.floor( WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolFee*100 , 2 );
                    this.poolURL = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolURL;
                    this.poolName = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolName;
                    this.poolWebsite = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolWebsite;

                    this.getPoolServers();

                    this.poolsList = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolsList;

                    let minerPoolFound = false;

                    if (WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.minerPoolActivated){

                        let minerPoolPublicKey = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolPublicKey.toString("hex");

                        for (let poolPublicKey in this.poolsList){

                            if (poolPublicKey === minerPoolPublicKey){
                                this.poolsListSelected = this.poolsList[poolPublicKey].poolName;
                                minerPoolFound = true;
                                break;
                            }

                        }

                    }

                    if (!minerPoolFound)
                        this.poolsListSelected = 'Pool Mining Disabled';

                    this.subscribeMinerPoolStatistics();

                }


            },

            getPoolServers(){
                let poolServers = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolServers;
                this.poolServers = WebDollar.Applications.PoolsUtilsHelper.getPoolServersStatus(poolServers);
            },

            subscribeMinerPoolStatistics(){

                if (this.subscribedMinerPoolStatistics) return ;

                this.subscribedMinerPoolStatistics = true;

                this.poolHashes = WebDollar.Blockchain.MinerPoolManagement.minerPoolStatistics.poolHashes;
                this.poolMinersOnline = WebDollar.Blockchain.MinerPoolManagement.minerPoolStatistics.poolMinersOnline.length;
                this.poolBlocksConfirmed = WebDollar.Blockchain.MinerPoolManagement.minerPoolStatistics.poolBlocksConfirmed;
                this.poolBlocksUnconfirmed = WebDollar.Blockchain.MinerPoolManagement.minerPoolStatistics.poolBlocksUnconfirmed;
                this.poolTimeRemaining = WebDollar.Blockchain.MinerPoolManagement.minerPoolStatistics.poolTimeRemaining;

                WebDollar.Blockchain.MinerPoolManagement.minerPoolStatistics.emitter.on("miner-pool/statistics/update",(data)=>{

                    this.poolHashes = data.poolHashes;
                    this.poolMinersOnline = data.poolMinersOnline;
                    this.poolBlocksConfirmed = data.poolBlocksConfirmed;
                    this.poolBlocksUnconfirmed = data.poolBlocksUnconfirmed;
                    this.poolTimeRemaining = data.poolTimeRemaining;

                });

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

            //servers

            WebDollar.StatusEvents.on("miner-pool/servers-connections",(data)=>{
                this.getPoolServers();
            });


        }

    }

</script>
