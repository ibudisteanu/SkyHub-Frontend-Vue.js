<template>

    <div id="p2p-network">


        <div id="createPoolSection">

            <h1 class="alignCenter bigMarginBottom">POOL Mining</h1>

            <div class="distributionContainer">

                <div class="distributionGrid borderBottom">
                    <h2 class="subtitle">{{ this.minerPoolStatus === 'miner' ? 'Referral Quick Actions' : 'Pool Quick Actions'}}</h2>
                </div>
                <div class="distributionGrid borderBottom">
                    <h2 class="subtitle">Pool Statistics</h2>
                </div>

                <div class="distributionGrid">

                    <div class="verticalAlignMiddle">

                        <div class="twoColums poolQuickActions" v-if="this.poolReferralFee!=0">

                            <router-link class="copyPoolLink" to="/pool">
                                Referrals Dashboard
                            </router-link>

                            <div>

                                <p class="copyPoolLink" @click="copyToClipboard">
                                    Copy Referral Link
                                </p>

                                <span :class="this.isNotNullColor"> Pool Referral Fee  {{this.poolReferralFee}} % </span>

                            </div>

                        </div>

                        <div v-if="this.poolReferralFee===0" class="poolQuickActions">

                            <span class="noMarginTop">Your current pools doesn't has referral system.</span>

                            <router-link class="copyPoolLink" to="/pool">
                                Create Your Own Pool
                            </router-link>

                        </div>

                    </div>

                </div>

                <pool-statistics ref="poolStatistics"
                                 statsType="miner" :poolName="poolName" :poolWebsite="poolWebsite" :poolURL="poolURL" :poolFee="poolFee" :poolReferralFee="poolReferralFee"
                                 :poolServers="poolServers"
                                 :poolStatus="minerPoolStatus" :poolHashes="poolHashes" :poolMinersOnline="poolMinersOnline"
                                 :poolBlocksConfirmed="poolBlocksConfirmed" :poolBlocksUnconfirmed="poolBlocksUnconfirmed" :poolBlocksConfirmedAndPaid="poolBlocksConfirmedAndPaid"
                                 :poolTimeRemaining="poolTimeRemaining" :rewardReferralTotal="rewardReferralTotal" :rewardReferralConfirmed="rewardReferralConfirmed"
                                 :poolBlocksBeingConfirmed="poolBlocksBeingConfirmed">
                </pool-statistics>

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
                poolFee: 0,
                poolReferralFee: 0,
                poolServers: {},
                minerPoolStatus: '',

                poolHashes: 0,
                poolMinersOnline: 0,
                poolBlocksConfirmed: 0,
                poolBlocksConfirmedAndPaid: 0,
                poolBlocksBeingConfirmed: 0,
                poolBlocksUnconfirmed: 0,

                poolTimeRemaining: 0,

                poolURLReferral: '',

                rewardReferralTotal: 0,
                rewardReferralConfirmed: 0,

                subscribedMinerPoolStatistics:false,

            }
        },

        components:{PoolStatistics},

        computed:{

            numberOfConnectedHosts(){

                let enabledHosts = 0;

                for(let key in this.poolServers)
                    if (this.poolServers[key].connected) enabledHosts++;

                return enabledHosts;

            },

            isNotNullColor(){

                if (this.numberOfConnectedHosts===0) return 'redColor';
                return 'greenColor';

            },

        },

        methods: {

            copyToClipboard(){
                this.$clipboard(this.poolURLReferral);
            },

            loadPoolData(){

                if ( WebDollar.Blockchain.MinerPoolManagement === undefined){

                    this.minerPoolStatus = "not initialized";

                } else {

                    if (WebDollar.Blockchain.MinerPoolManagement.minerPoolInitialized) this.minerPoolStatus = "initialized";
                    if (WebDollar.Blockchain.MinerPoolManagement.minerPoolOpened) this.minerPoolStatus = "configured";
                    if (WebDollar.Blockchain.MinerPoolManagement.minerPoolStarted) this.minerPoolStatus = "started";

                    this.poolFee = Math.floor( WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolFee*100 , 2 );
                    this.poolReferralFee = Math.floor( WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolReferralFee*100 , 2 );
                    this.poolURL = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolURL;
                    this.poolName = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolName;
                    this.poolWebsite = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolWebsite;

                    this.poolURLReferral = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolURLReferral;

                    this.getPoolServers();

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
                this.poolBlocksConfirmedAndPaid = WebDollar.Blockchain.MinerPoolManagement.minerPoolStatistics.poolBlocksConfirmedAndPaid;
                this.poolBlocksUnconfirmed = WebDollar.Blockchain.MinerPoolManagement.minerPoolStatistics.poolBlocksUnconfirmed;
                this.poolBlocksBeingConfirmed = WebDollar.Blockchain.MinerPoolManagement.minerPoolStatistics.poolBlocksBeingConfirmed;
                this.poolTimeRemaining = WebDollar.Blockchain.MinerPoolManagement.minerPoolStatistics.poolTimeRemaining;


                WebDollar.Blockchain.MinerPoolManagement.minerPoolStatistics.emitter.on("miner-pool/statistics/update",(data)=>{

                    this.poolHashes = data.poolHashes;
                    this.poolMinersOnline = data.poolMinersOnline;
                    this.poolBlocksConfirmed = data.poolBlocksConfirmed;
                    this.poolBlocksConfirmedAndPaid = data.poolBlocksConfirmedAndPaid;
                    this.poolBlocksUnconfirmed = data.poolBlocksUnconfirmed;
                    this.poolBlocksBeingConfirmed = data.poolBlocksBeingConfirmed;
                    this.poolTimeRemaining = data.poolTimeRemaining;

                });

            }


        },

        mounted() {


            if (typeof window === "undefined") return;

            WebDollar.StatusEvents.on("miner-pool/status", data => this.loadPoolData() );

            WebDollar.StatusEvents.on("miner-pool/settings",data =>  this.loadPoolData() );

            WebDollar.StatusEvents.on("miner-pool/referral-url", data =>  this.poolURLReferral = data.poolURLReferral );

            this.loadPoolData();

            WebDollar.StatusEvents.on("miner-pool/referral-confirmed-reward", data => this.rewardReferralConfirmed = data.referralConfirmedReward );
            WebDollar.StatusEvents.on("miner-pool/referral-total-reward", data => this.rewardReferralTotal = data.referralTotalReward );

            if (WebDollar.Blockchain.MinerPoolManagement !== undefined){
                this.rewardReferralTotal = WebDollar.Blockchain.MinerPoolManagement.totalReferralReward;
                this.rewardReferralConfirmed = WebDollar.Blockchain.MinerPoolManagement.confirmedReferralReward;
            }

            //servers

            WebDollar.StatusEvents.on("miner-pool/servers-connections",(data)=>{
                this.getPoolServers();
            });




        }

    }

</script>

<style>

    .poolQuickActions{
        max-width: 540px;
        margin:auto;
    }

    .poolQuickActions span{
        text-align: center;
        margin-top: 20px;
        color: #fff;
    }

    .noMarginTop{
        margin-top: 0!important;
        margin-bottom: 20px!important;
    }

</style>