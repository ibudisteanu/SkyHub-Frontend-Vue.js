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
                <div class="distributionGrid poolDescription">

                    <div class="verticalAlignMiddle">

                        <span class="oneLineText">
                            Your Role: <span class="normalSpan yellowColor"> Miner </span>
                        </span>
                        <span class="oneLineText">
                            Pool Name: <span class="normalSpan yellowColor"> <a :href="this.poolWebsite"> {{this.poolName}} </a></span>
                        </span>
                        <span class="oneLineText">
                            Pool Status: <span class="normalSpan" :class="this.selectStatusColor()">{{ this.minerPoolStatus }}</span>
                        </span>
                        <span class="oneLineText">
                            Pool Fee: <span class="normalSpan yellowColor"> <a :href="this.poolWebsite"> {{this.poolFee}} </a></span>
                        </span>
                        <span class="oneLineText">
                            Online Hosts: <span class="normalSpan" :class="this.selectOnlineHostColor()"> {{ this.onlineHosts() }} </span>
                        </span>
                        <span class="oneLineText">
                            Pool Hash: <span class="normalSpan yellowColor"> 500 MH/s </span>
                        </span>
                        <span class="oneLineText">
                            Miners: <span class="normalSpan" :class="this.isNotNullColor()"> {{this.poolMinerNumber}} </span>
                        </span>

                    </div>

                </div>

            </div>

        </div>

    </div>

</template>

<script>

    import Vue from 'vue';
    import Clipboard from 'v-clipboard';

    Vue.use(Clipboard);

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

        methods: {

            numberOfConnectedHosts(){

                var enabledHosts=0;

                for(var i=0;i<=this.poolServers;i++){

                    if(this.poolServers.connected === true) enabledHosts++

                }

                return enabledHosts;

            },

            copyToClipboard(){
                this.$clipboard(this.poolURL);
            },

            isNotNullColor(){

                if (this.poolMinerNumber===0) return 'redColor';

                return 'greenColor';

            },

            selectStatusColor(){

                if (this.poolStatus==='Started') return 'greenColor';
                if (this.poolStatus==='Configured') return 'redColor';

                return 'yellowColor';

            },

            selectOnlineHostColor(){

                if(this.numberOfConnectedHosts()===0)  return 'redColor';

                if (Object.keys(this.poolServers).length=== this.numberOfConnectedHosts()) return 'greenColor';

                return 'yellowColor'

            },

            onlineHosts(){

                return this.numberOfConnectedHosts() + ' / ' + Object.keys(this.poolServers).length;

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
                    this.poolDescription = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolDescription;

                    let poolServers = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolServers;
                    this.poolServers = WebDollar.Applications.PoolsUtilsHelper.getPoolServersStatus(poolServers);

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