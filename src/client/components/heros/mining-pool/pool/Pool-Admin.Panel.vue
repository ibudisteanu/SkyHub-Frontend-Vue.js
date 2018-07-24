<template>

    <div>

        <div id="miningPoolController">

            <div class="generalController" :class="this.menuClass">

                <div class="listType" v-if="!this.showAdvancedSettingsStatus" >
                    <span class="minerData buttonSmall" @click="changeDisplayType('list')" :class="this.displayType === 'list' ? 'selected' : ''">LIST</span>
                    <span class="minerData buttonSmall" @click="changeDisplayType('normal')"  :class="this.displayType === 'normal' ? 'selected' : ''">NORMAL</span>
                </div>

                <div v-if="!this.showReferralListStatus" class="buttonContainer poolSingleButton">
                    <span v-on:click="this.showReferralListEnable" class="minerData buttonSmall settingsButton" >
                       {{ this.pool.iAmOwner ? 'Pool Referrals' : 'Your Referrals' }}
                    </span>
                </div>

                <div v-if="!this.showMinersListStatus && this.pool.iAmOwner" class="buttonContainer poolSingleButton">
                    <span v-on:click="this.showMinersListEnable" class="minerData buttonSmall settingsButton" >
                        Miners List
                    </span>
                </div>

                <div v-if="!this.showAdvancedSettingsStatus" class="buttonContainer poolSingleButton">
                    <span v-on:click="this.showAdvancedSettingsEnable" class="minerData buttonSmall settingsButton" >
                        {{ this.pool.iAmOwner ? 'Advanced Settings' : 'Create your own pool' }}
                    </span>
                </div>

            </div>

            <div class="infoSection">

                <!--<pool-miner-details v-if="this.showMinersListStatus" :miner="this.minersList[this.selectedMinerIndex]"></pool-miner-details>-->

                <pool-referral-details v-if="this.showReferralListStatus" :miner="this.minersList[this.selectedMinerIndex]"></pool-referral-details>

                <!--<pool-details v-if="this.showAdvancedSettingsStatus" :pool="this.pool"></pool-details>-->

            </div>

        </div>

        <div id="yourPoolSection">

            <!--<pool-miners-list v-if="this.showMinersListStatus && this.pool.iAmOwner" :displayType="this.displayType" :minersList="this.minersList" @selectMiner="this.selectNewMiner"></pool-miners-list>-->

            <pool-referral-list v-if="this.showReferralListStatus" :displayType="this.displayType" :minersList="this.minersList" @selectMiner="this.selectNewMiner"></pool-referral-list>

            <!--<SettingsPage v-if="this.showAdvancedSettingsStatus"></SettingsPage>-->

        </div>

    </div>
    
</template>

<script>

    import Vue from 'vue/dist/vue';
    import slider from 'client/components/UI/elements/Slider.vue';
    import PoolMinersList from "./components/Pool-Miners-List.vue";
    import PoolReferralList from "../pools/referrals/Pool-Referral-List.vue";
    import SettingsPage from "./components/Pool-Advanced-Settings.vue";
    import PoolMinerDetails from "./components/Pool-Miner-Details.vue";
    import PoolDetails from "./components/Pool-Details.vue";
    import PoolReferralDetails from "../pools/referrals/Pool-Referral-Details.vue";

    export default{

        components: { PoolMinersList, slider, SettingsPage, PoolMinerDetails, PoolDetails, PoolReferralList, PoolReferralDetails },

        data: () => {
            return {
                showAdvancedSettingsStatus: false,
                showMinersListStatus: true,
                showReferralListStatus: false,
                displayType: 'list',
                pool: {
                    address: 'WEBD$gCPE#0MUG@ReQk3wD7EB5vmMGDdo#YhHSr$',
                    Fee: 0,
                    poolName: '',
                    poolWebsite: '',
                    poolURL: '',
                    iAmOwner: false
                },
                selectedMinerIndex: 0,
                minersList:[
                    {
                        active:false,
                        refereeAddress:'WEBD$gACWpxpuUF5PWY#EFJ+oL1yiVHvaV+nL6P$',
                        refereeMiner:'WEBD$gA7npK@#CUjgJDXeN+mV1JBKE@x6HfX96z$',
                        _rewardReferralSent:50000,
                        _rewardReferralTotal:6000
                    },
                    {
                        active:true,
                        refereeAddress:'WEBD$gACWpxpuUF5PWY#EFJ+oL1yiVHvaV+nL6P$',
                        refereeMiner:'WEBD$gA7npK@#CUjgJDXeN+mV1JBKE@x6HfX96z$',
                        _rewardReferralSent:40000,
                        _rewardReferralTotal:4000
                    },
                    {
                        active:true,
                        refereeAddress:'WEBD$gACWpxpuUF5PWY#EFJ+oL1yiVHvaV+nL6P$',
                        refereeMiner:'WEBD$gA7npK@#CUjgJDXeN+mV1JBKE@x6HfX96z$',
                        _rewardReferralSent:30000,
                        _rewardReferralTotal:3000
                    },
                    {
                        active:true,
                        refereeAddress:'WEBD$gACWpxpuUF5PWY#EFJ+oL1yiVHvaV+nL6P$',
                        refereeMiner:'WEBD$gA7npK@#CUjgJDXeN+mV1JBKE@x6HfX96z$',
                        _rewardReferralSent:20000,
                        _rewardReferralTotal:2000
                    },
                ]
            }
        },

        methods: {

            loadPoolData(){

            },

            menuClass(){

                if( !this.pool.iAmOwner ){

                    if (this.showAdvancedSettingsStatus) return 'ajustedHeightMiner';
                        else return 'normalMiner';

                }
                else{

                    if (this.showAdvancedSettingsStatus) return 'ajustedHeight';

                }

            },

            changeDisplayType(type){
                this.displayType=type;
            },

            handleChangePoolFee(value){
                this.poolFee = value;
            },

            handleSaveSettings(){

                WebDollar.Blockchain.PoolManagement._poolFee =  this.poolFee;
                WebDollar.Blockchain.PoolManagement._poolName = this.poolName;
                WebDollar.Blockchain.PoolManagement._poolWebsite = this.poolWebsite;

                WebDollar.Blockchain.PoolManagement.savePoolDetails();

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

            selectNewMiner(index){
                this.selectedMinerIndex = index;
            },

            selectUserStatus(){

                if(this.pool.iAmOwner === false){

                    this.showMinersListStatus=false;

                    if(!this.showAdvancedSettingsStatus) this.showReferralListStatus = true;

                }

            },

        },

        mounted() {

            if (typeof window === 'undefined') return;

            this.loadPoolData();
            this.selectUserStatus();

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

    .ajustedHeightMiner{
        height: 35px!important;
    }

    .ajustedHeight{
        height: 85px!important;
    }

</style>