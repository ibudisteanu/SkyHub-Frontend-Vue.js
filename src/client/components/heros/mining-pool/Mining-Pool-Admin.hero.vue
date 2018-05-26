<template>

    <div>

        <div id="miningPoolController">

            <div class="generalController">

                <h2>SETTINGS</h2>

                <slider ref="refMiningSlider" @changed="this.handleChangePoolFee"/>

                <div class="listType">

                    <span class="minerData buttonSmall" @click="changeDisplayType('list')" :class="this.displayType === 'list' ? 'selected' : ''">LIST</span>
                    <span class="minerData buttonSmall" @click="changeDisplayType('normal')"  :class="this.displayType === 'normal' ? 'selected' : ''">NORMAL</span>

                </div>

                <div class="buttonContainer">
                    <button v-on:click="this.showAdvancedSettings" class="minerData buttonSmall settingsButton">{{ !this.showAdvancedSettingsStatus ? 'Advanced Settings' : 'Miners List' }}</button>
                </div>

            </div>

            <h2>Selected miner statistics</h2>

            <div class="selectedMinerInfo">

                <p>
                    <span class="titlePool">Pool address:</span>
                    <span class="minerData address">{{this.poolLeader.address}}</span>
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

            <pool-miners-list v-if="!this.showAdvancedSettingsStatus" :displayType="this.displayType"></pool-miners-list>

            <SettingsPage v-else="this.showAdvancedSettingsStatus"></SettingsPage>

        </div>

    </div>
    
</template>

<script>

    import Vue from 'vue/dist/vue';
    import slider from 'client/components/UI/elements/Slider.vue';
    import PoolMinersList from  "./components/Pool-Miners-List.vue";
    import SettingsPage from "./components/Pool-Advanced-Settings.vue";

    export default{

        components: { PoolMinersList, slider, SettingsPage },

        data: () => {
            return {
                showAdvancedSettingsStatus: false,
                displayType: 'list',
                poolLeader:{
                    address: 'WEBD$gCPE#0MUG@ReQk3wD7EB5vmMGDdo#YhHSr$',
                    poolLeaderCommission: 20
                },
                poolFee: 0,
                poolName: '',
                poolWebsite: '',
                poolURL: '',
            }
        },

        methods: {

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

            handleGenerateLink(){

                this.poolURL = WebDollar.Blockchain.PoolManagement.generatePoolURL();
            },

            showAdvancedSettings(){
                this.showAdvancedSettingsStatus = !this.showAdvancedSettingsStatus;
            }

        },

        mounted() {

            if (typeof window === 'undefined') return;

            Vue.use(Clipboard);

        }

    }

</script>

<style>
    .poolSettingsRow{
        display: grid;
        grid-template-columns: 100px 1fr;
    }

    .settingsButton{
        background-color: #fec02c;
        color:#000;
        border:none;
        padding: 5px 20px;
        margin: 0 auto;
        left:0;
        display: block;
        right: 0;
        border-radius: 3px;
        transition: all 0.5s ease
    }

    .settingsButton:hover{
        background-color: #fedd88;
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

</style>