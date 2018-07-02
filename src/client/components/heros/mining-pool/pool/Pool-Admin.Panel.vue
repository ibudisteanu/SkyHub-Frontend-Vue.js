<template>

    <div>

        <div id="miningPoolController">

            <div class="generalController" :class="this.showAdvancedSettingsStatus ? 'ajustedHeight' : ''">

                <div class="listType" v-if="!this.showAdvancedSettingsStatus" >

                    <span class="minerData buttonSmall" @click="changeDisplayType('list')" :class="this.displayType === 'list' ? 'selected' : ''">LIST</span>
                    <span class="minerData buttonSmall" @click="changeDisplayType('normal')"  :class="this.displayType === 'normal' ? 'selected' : ''">NORMAL</span>

                </div>

                <div class="buttonContainer" :class="this.showAdvancedSettingsStatus ? 'poolSingleButton' : ''">
                    <span v-on:click="this.showAdvancedSettings" class="minerData buttonSmall settingsButton" >
                        {{ !this.showAdvancedSettingsStatus ? 'Advanced Settings' : 'Miners List' }}
                    </span>
                </div>

            </div>

            <div class="infoSection">

                <pool-miner-details v-if="!this.showAdvancedSettingsStatus" :miner="this.minersList[this.selectedMinerIndex]"></pool-miner-details>

                <pool-details v-if="this.showAdvancedSettingsStatus" :pool="this.poolDetails"></pool-details>

            </div>

        </div>

        <div id="yourPoolSection">

            <pool-miners-list v-if="!this.showAdvancedSettingsStatus" :displayType="this.displayType" :minersList="this.minersList" @selectMiner="this.selectNewMiner"></pool-miners-list>

            <settings-page v-else="this.showAdvancedSettingsStatus"></settings-page>

        </div>

    </div>
    
</template>

<script>

    import Vue from 'vue/dist/vue';
    import slider from 'client/components/UI/elements/Slider.vue';
    import PoolMinersList from "./components/Pool-Miners-List.vue";
    import SettingsPage from "./components/Pool-Advanced-Settings.vue";
    import PoolMinerDetails from "./components/Pool-Miner-Details.vue";
    import PoolDetails from "./components/Pool-Details.vue";

    export default{

        components: { PoolMinersList, slider, SettingsPage, PoolMinerDetails, PoolDetails },

        data: () => {
            return {
                showAdvancedSettingsStatus: false,
                displayType: 'list',
                poolDetails: {
                    address: 'WEBD$gCPE#0MUG@ReQk3wD7EB5vmMGDdo#YhHSr$',
                    Fee: 0,
                    poolName: '',
                    poolWebsite: '',
                    poolURL: '',
                },
                selectedMinerIndex: 0,
                minersList: [
                    {
                        active: true,
                        address: 'WEBD$gCPE#0MUG@RedsadasQk3wD7EB5vmMGDdo#YhHSr$',
                        nextReward: '2020',
                        avaiableReward: '200200',
                        averageHash: '',
                    },
                    {
                        active: true,
                        address: 'WEBD$gCPE#0MUG@ReQksdas3wD7EB5vmMGDdo#YhHSr$',
                        nextReward: '2100',
                        avaiableReward: '200100',
                        averageHash: '',
                    },
                    {
                        active: true,
                        address: 'WEBD$gCPE#0MUG@RgasdaseQk3wD7EB5vmMGDdo#YhHSr$',
                        nextReward: '200',
                        avaiableReward: '20000',
                        averageHash: '',
                    },
                    {
                        active: true,
                        address: 'WEBD$gCPE#0MUG@ReQk3wD7EB5vmMGDdo#YhHSr$',
                        nextReward: '2300',
                        avaiableReward: '20030',
                        averageHash: '',
                    },
                    {
                        active: true,
                        address: 'WEBD$gCPE#0MUG@ReQk3wD7EB5vmMGDdo#YhHSr$',
                        nextReward: '200',
                        avaiableReward: '20000',
                        averageHash: '',
                    },
                    {
                        active: true,
                        address: 'WEBD$gCPE#0MUG@ReQk3wD7EB5vmMGDdo#YhHSr$',
                        nextReward: '200',
                        avaiableReward: '20000',
                        averageHash: '',
                    },
                    {
                        active: true,
                        address: 'WEBD$gCPE#0MUG@ReQk3wD7EB5vmMGDdo#YhHSr$',
                        nextReward: '200',
                        avaiableReward: '20000',
                        averageHash: '',
                    },
                    {
                        active: false
                    },
                    {
                        active: false
                    },
                    {
                        active: true
                    },
                    {
                        active: false
                    },
                    {
                        active: true
                    },
                    {
                        active: false
                    },
                    {
                        active: true
                    },
                    {
                        active: false
                    },
                    {
                        active: false
                    },
                    {
                        active: true
                    },
                    {
                        active: false
                    },
                    {
                        active: true
                    },
                    {
                        active: false
                    },
                    {
                        active: true
                    },
                    {
                        active: false
                    }
                ]
            }
        },

        methods: {

            loadPoolData(){



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

            showAdvancedSettings(){
                this.showAdvancedSettingsStatus = !this.showAdvancedSettingsStatus;
            },

            selectNewMiner(index){

                this.selectedMinerIndex = index;

            }

        },

        mounted() {

            if (typeof window === 'undefined') return;

            this.loadPoolData();

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

    .ajustedHeight{
        height: 35px!important;
    }

</style>