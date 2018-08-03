<template>

    <div>

        <div id="miningPoolController">

            <div class="generalController" :class="this.menuClass">

                <div class="listType" v-if="!this.showAdvancedSettingsStatus" >
                    <span class="minerData buttonSmall" @click="changeDisplayType('list')" :class="this.displayType === 'list' ? 'selected' : ''">LIST</span>
                    <span class="minerData buttonSmall" @click="changeDisplayType('normal')"  :class="this.displayType === 'normal' ? 'selected' : ''">NORMAL</span>
                </div>

                <!--<div v-if="!this.showReferralListStatus" class="buttonContainer poolSingleButton">-->
                    <!--<span v-on:click="this.showReferralListEnable" class="minerData buttonSmall settingsButton" >-->
                       <!--{{ this.poolIAmOwner ? 'Pool Referrals' : 'Your Referrals' }}-->
                    <!--</span>-->
                <!--</div>-->

                <!--<div v-if="!this.showMinersListStatus && this.poolIAmOwner " class="buttonContainer poolSingleButton">-->
                    <!--<span v-on:click="this.showMinersListEnable" class="minerData buttonSmall settingsButton" >-->
                        <!--Miners List-->
                    <!--</span>-->
                <!--</div>-->

                <!--<div v-if="!this.showAdvancedSettingsStatus" class="buttonContainer poolSingleButton">-->
                    <!--<span v-on:click="this.showAdvancedSettingsEnable" class="minerData buttonSmall settingsButton" >-->
                        <!--{{ this.poolIAmOwner  ? 'Advanced Settings' : 'Create your own pool' }}-->
                    <!--</span>-->
                <!--</div>-->

            </div>

            <div class="infoSection" :class="this.selectedIndex>0 ? '' : 'hide'">

                <!--<pool-miner-details v-if="this.showMinersListStatus" :selectedIndex="this.selectedIndex"></pool-miner-details>-->

                <referral-details ref="referralDetails" v-if="this.showReferralListStatus" ></referral-details>

                <!--<pool-details v-if="this.showAdvancedSettingsStatus" :pool="this.pool"></pool-details>-->

            </div>

        </div>

        <div id="yourPoolSection">

            <!--<pool-miners-list v-if="this.showMinersListStatus && this.poolIAmOwner " :displayType="this.displayType" :minersList="this.minersList" @selectMiner="this.selectNewMiner"></pool-miners-list>-->

            <referral-list ref="referralList" v-if="this.showReferralListStatus" :displayType="this.displayType" @selectReferee="this.selectIndex"></referral-list>

            <!--<SettingsPage v-if="this.showAdvancedSettingsStatus"></SettingsPage>-->

        </div>

    </div>

</template>

<script>

    import Vue from 'vue/dist/vue';
    import ReferralList from "./common/referrals/Referral-List.vue";
    import ReferralDetails from "./common/referrals/Referral-Details.vue";
    import PoolMinersList from "./pool/components/Pool-Miners-List.vue"
    import PoolMinerDetails from "./pool/components/Pool-Miner-Details.vue"
    import SettingsPage from "./pool/components/Pool-Advanced-Settings.vue"

    export default{

        components: { ReferralList, ReferralDetails, PoolMinersList, PoolMinerDetails, SettingsPage },

        data: () => {

            return {
                showAdvancedSettingsStatus: false,
                showMinersListStatus: true,
                showReferralListStatus: false,

                displayType: 'normal',

                type: 'none',
                advancedStatus: 'not initialized',

                referralData: {},
                
                selectedIndex: -1,


                poolAddress: 'WEBD$gCPE#0MUG@ReQk3wD7EB5vmMGDdo#YhHSr$',
                poolFee: 0,
                poolName: '',
                poolWebsite: '',
                poolURL: '',
                poolIAmOwner: false,

            }
        },

        methods: {

            loadAdminData(){

                if (WebDollar.Blockchain.MinerPoolManagement !== undefined && WebDollar.Blockchain.MinerPoolManagement.minerPoolStarted )
                    return this.loadMinerPoolData();


                if (WebDollar.Blockchain.PoolManagement !== undefined)
                    return this.loadPoolData();

            },

            loadPoolData(){

                if (WebDollar.Blockchain.PoolManagement === undefined){

                    this.type = "none";
                    this.advancedStatus = "not initialized";

                } else {

                    if (WebDollar.Blockchain.PoolManagement.poolInitialized) this.advancedStatus = "Initialized";
                    if (WebDollar.Blockchain.PoolManagement.poolOpened) this.advancedStatus = "Configured";
                    if (WebDollar.Blockchain.PoolManagement.poolStarted) {
                        this.advancedStatus = "Started";
                        this.type = "pool";
                    }

                    this.poolURL = WebDollar.Blockchain.PoolManagement.poolSettings.poolURL;

                    this.poolAddress = WebDollar.Blockchain.PoolManagement.poolSettings.poolAddress||'';
                    this.poolFee = Math.floor( WebDollar.Blockchain.PoolManagement.poolSettings.poolFee*100 , 2 );
                    this.poolReferralFee = Math.floor( WebDollar.Blockchain.PoolManagement.poolSettings.poolReferralFee*100 , 2 );
                    this.poolURL = WebDollar.Blockchain.PoolManagement.poolSettings.poolURL;
                    this.poolName = WebDollar.Blockchain.PoolManagement.poolSettings.poolName;
                    this.poolWebsite = WebDollar.Blockchain.PoolManagement.poolSettings.poolWebsite;

                    this.getMinerPoolServers();

                    this.showMinersListEnable();

                }

            },

            loadMinerPoolData(){

                if ( WebDollar.Blockchain.MinerPoolManagement === undefined){

                } else {

                    if (WebDollar.Blockchain.MinerPoolManagement.minerPoolInitialized) this.advancedStatus = "initialized";
                    if (WebDollar.Blockchain.MinerPoolManagement.minerPoolOpened) this.advancedStatus = "configured";
                    if (WebDollar.Blockchain.MinerPoolManagement.minerPoolStarted){
                        this.advancedStatus = "started";
                        this.type = "miner";
                    }

                    this.poolAddress = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolAddress||'';
                    this.poolFee = Math.floor( WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolFee*100 , 2 );
                    this.poolReferralFee = Math.floor( WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolReferralFee*100 , 2 );
                    this.poolURL = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolURL;
                    this.poolName = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolName;
                    this.poolWebsite = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolWebsite;

                    this.poolURLReferral = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolURLReferral;

                    this.getPoolServers();

                    this.showReferralListEnable();

                }

            },

            getPoolServers(){
                let poolServers = WebDollar.Blockchain.PoolManagement.poolSettings.poolServers;
                this.poolServers = WebDollar.Applications.PoolsUtilsHelper.getPoolServersStatus(poolServers);
            },

            getMinerPoolServers(){
                let poolServers = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolServers;
                this.poolServers = WebDollar.Applications.PoolsUtilsHelper.getPoolServersStatus(poolServers);
            },

            changeDisplayType(type){
                this.displayType=type;
            },

            showAdvancedSettingsEnable(){
                this.showReferralListStatus = false;
                this.showMinersListStatus = false;
                this.showAdvancedSettingsStatus = true;
            },

            showReferralListEnable(){
                this.showAdvancedSettingsStatus = false;
                this.showMinersListStatus = false;
                this.showReferralListStatus = true;
            },

            showMinersListEnable(){
                this.showMinersListStatus = true;
                this.showReferralListStatus = false;
                this.showAdvancedSettingsStatus = false;
            },

            loadMinerPoolReferralData(){

                if (WebDollar.Blockchain.MinerPoolManagement === undefined) return;

                this.referralData = WebDollar.Blockchain.MinerPoolManagement.minerPoolReferrals.referralData;

                this.$refs['referralList'].setReferralList(this.referralData);

                this.$refs['referralDetails'].setReferralLinkAddress(this.referralData.referralLinkAddress, this.referralData.referralLinkAddressOnline);

                if (this.selectedIndex = -1)
                    this.selectIndex(0, true);

            },

            selectUserStatus(){

                if (this.poolIAmOwner  === false){

                    this.showMinersListStatus=false;

                    if (!this.showAdvancedSettingsStatus) this.showReferralListStatus = true;

                }

            },

            selectIndex(index){

                if ( index >= this.referralData.referees.length )
                    return;

                this.selectedIndex = index;
                this.$refs['referralDetails'].setReferee(this.referralData.referees[index]);
            },

        },

        computed:{

            menuClass(){

                if( !this.poolIAmOwner  ){

                    if (this.showAdvancedSettingsStatus) return 'adjustedHeightMiner';
                    else return 'normalMiner';

                }
                else
                if (this.showAdvancedSettingsStatus) return 'adjustedHeight';


            },

        },

        async mounted() {

            if (typeof window === 'undefined') return;

            WebDollar.StatusEvents.on("miner-pool/status", (data)=> this.loadAdminData() );

            WebDollar.StatusEvents.on("pools/status", (data) => this.loadAdminData() );

            this.loadAdminData();

            this.selectUserStatus();


            await WebDollar.Blockchain.onLoaded;

            WebDollar.Blockchain.MinerPoolManagement.minerPoolReferrals.requireReferrals = true;
            WebDollar.Blockchain.MinerPoolManagement.minerPoolReferrals.requestReferrals();

            WebDollar.StatusEvents.on("mining-pool/pool-referral-data-changed", (data) => this.loadMinerPoolReferralData() );
            this.loadMinerPoolReferralData();


        },

    }

</script>

<style>

    .poolSingleButton{
        margin: 44px 0;
    }

    .poolSettingsRow{
        display: grid;
        grid-template-columns: 100px 1fr;
    }

    .generalController .settingsButton{
        background-color: #fec02c;
        color:#000;
        border:none;
        margin: 0 auto;
        width: 85%;
        left:0;
        display: block;
        right: 0;
        border-radius: 0;
        text-align: center;
        font-size: 12px;
        text-transform: uppercase;
        transition: all 0.5s ease
    }

    .normalMiner{
        height: 100px!important;
    }

    .generalController .settingsButton:hover{
        background-color: #fedd88;
        transition: all 0.5s ease
    }

    .generalController .buttonSmall{
        box-sizing: border-box!important;
    }

    .poolSectionContainer .list .transactionInfo:hover{
        background-color: #333;
        transition: all 0.5s ease
    }

    .buttonContainer{
        display: block;
        margin: 20px 0;
    }

    .smallSettings{
        display: grid;
        grid-template-columns: 1fr;
        padding: 5px;
        grid-row-gap: 5px;
    }

    .settingsTitle{
        font-size: 14px;
        text-transform: capitalize;
    }

    .poolSettingsRow input{
        background-color: #e4e4e4;
        border: solid 1px #ffffff;
        border-radius: 3px;
        width: 100%;
    }

    .listType .buttonSmall{
        font-size: 12px;
        border-radius:3px;
        margin: 15px 5px 0 5px;
    }

    .listType{
        width: 100%;
        display: block;
        text-align: center;
        margin-top: 10px;
    }

    .listType .minerData{
        display: block;
        width: 85%;
        margin: 0 auto;
        border-radius: 0;
        background-color: #262626;
        color: #fff
    }

    .listType .selected{
        background-color: #424242;
        color: #fff;
        transition: all 0.5s ease
    }

    .vue-slider-tooltip{
        padding: 0!important;
    }

    .adjustedHeightMiner{
        height: 35px!important;
    }

    .adjustedHeight{
        height: 85px!important;
    }

    .infoSection{
        border-radius: 5px;
        border: solid 1px #000000;
        margin-left: 8px;
    }

</style>