<template>

    <div id="p2p-network">

        <div id="createPoolSection">

            <div class="">

                <h1 class="alignCenter bigMarginBottom">Miner Pool</h1>

                <h3 class="alignLeft bigMarginBottom">Status: {{ this.minerPoolStatus }}</h3>

                <h4 class="alignCenter">Name: {{this.poolName}}</h4>
                <h4 class="alignCenter">Website: {{this.poolWebsite}}</h4>
                <h4 class="alignCenter">Fee: {{this.poolFee}} % </h4>

                <div class="distributionContainer">

                    <div class="distributionGrid">

                        <div class="verticalAlignMiddle">

                            <p class="subtitle">REWARD: {{this.minerPoolReward}}</p>

                            <p class="createPoolLink">{{this.poolDescription}}</p>

                            <div class="dataStatisticsItem" v-for="(poolServer, index) in this.poolServers">
                                <span class="titlePool serverPool" >{{poolServer.name}}</span>
                                <span class="minerData serverPoolStatus" >{{poolServer.connected ? 'established' : 'not established'}} </span>
                            </div>


                            <select v-model="poolsListSelected">
                                <option>Pool Mining Disabled</option>
                                <option v-for="(poolListElement, index) in this.poolsList">
                                    {{poolListElement.poolName}}
                                </option>
                            </select>


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

                minerPoolStatus: '',
                minerPoolReward: 0,

                poolName: '',
                poolWebsite: '',
                poolURL: '',
                poolDescription: '',
                poolFee: '',

                poolServers: {},

                poolsList: {},
                poolsListSelected: '',

            }
        },

        components: {
            "slider":slider
        },

        methods: {

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
                    this.poolDescription = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolDescription;

                    let poolServers = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolServers;
                    this.poolServers = WebDollar.Applications.PoolsUtilsHelper.getPoolServersStatus(poolServers);

                    this.poolsList = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolsList;

                    let minerPoolFound = false;

                    if (WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.minerPoolActivated){

                        let minerPoolPublicKey = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.minerPoolPublicKey.toString("hex");

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