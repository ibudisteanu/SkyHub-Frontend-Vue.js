<template>

    <Div>

        <div id="miningPoolController">

            <div class="generalController">

                <h2>Your commission</h2>

                <slider ref="refMiningSlider" @sliderChanged="this.changeCommission"/>

                <p class="copyPoolLink" @click="copyToClipboard">
                    Copy invite link
                </p>

            </div>

            <h2>GENERAL INFO</h2>

            <div class="selectedMinerInfo">

                <p>
                    <span class="titlePool">Pool address:</span>
                    <span class="minerData address">{{this.poolLeader.address}}</span>
                </p>

                <p>
                    <span class="titlePool">Display Type:</span>
                    <span class="minerData buttonSmall" @click="changeDisplayType('list')" :class="this.displayType === 'list' ? 'selected' : ''">LIST</span>
                    <span class="minerData buttonSmall" @click="changeDisplayType('normal')"  :class="this.displayType === 'normal' ? 'selected' : ''">NORMAL</span>
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

            <div class="poolSectionContainer">

                <div v-if="this.displayType==='normal'" class="poolContainer">

                    <div v-for="(element, index) in this.minersList" :key="'InstagramRankingListElement '+index"  class="miner" :class="element.active===true ? 'activeMiner' : ''">
                        <img alt="picker" src="/public/assets/images/picker.png"/>
                        <span class="status">{{element.active===true ? 'Mining' : 'Offline'}}</span>
                    </div>

                </div>

                <div v-if="this.displayType==='list'" class="list">

                    <div v-for="(element, index) in this.minersList" :key="'InstagramRankingListElement '+index" class="transactionInfo">
                        <span class="status" :class="element.active===true ? 'yellowText' : ''">{{element.active===true ? 'Mining' : 'Offline'}}</span>
                        <span class="time">{{element.nextReward + ' WEBD'}}</span>
                        <span class="minedBy">{{element.address}}</span>
                        <span class="size yellowText">{{element.avaiableReward}}</span>
                    </div>

                </div>


            </div>

        </div>

    </Div>
    
</template>

<script>

    import Vue from 'vue/dist/vue';
    import Utils from 'src/utils/util-functions'
    import slider from '../UI/elements/Slider.vue';
    import Clipboard from 'v-clipboard';

    export default{

        components: {
            "slider":slider
        },

        data: () => {
            return {
                displayType: 'list',
                poolLeader:{
                    address: 'WEBD$gCPE#0MUG@ReQk3wD7EB5vmMGDdo#YhHSr$',
                    poolLeaderCommission: 20
                },
                minersList: [
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

            changeCommission(){

            },

            copyToClipboard(){
                this.$clipboard('test-link');
            },

            changeDisplayType(type){
                this.displayType=type;
            },

            moneyFormat(amount,decimals=0){
                return Utils.formatMoneyNumber(amount,decimals);
            }

        },

        mounted() {

            if (typeof window === 'undefined') return;


            Vue.use(Clipboard);

        },

        computed:{

            Utils(){
                return Utils;
            }

        },

    }

</script>

<style>

    .miner{
        cursor: pointer;
        transition: all .5s linear;
    }

    .miner:hover{
        -webkit-box-shadow: 0px 0px 48px -2px rgba(255,255,255,1);
        -moz-box-shadow: 0px 0px 48px -2px rgba(255,255,255,1);
        box-shadow: 0px 0px 48px -2px rgba(255,255,255,1);
        transition: all .3s linear;
    }

    .transactionInfo{
        width: 100%;
        display: grid;
        grid-template-columns: 100px 180px 1fr 100px;
        margin: 10px 0;
        background-color: #ffffff21;
        text-align: center;
    }

    .buttonSmall{
        cursor: pointer;
        background-color: #6f6e6f;
        color: #ffffff;
        margin-right: 10px;
        padding: 0 10px;
        border-radius: 5px;
    }

    .selected{
        background-color: #fec02c;
        color: #000;
    }

    .yellowText{
        color:#fec02c;
    }

    .generalController{
        padding-top: 65px;
        background-color: #2d2d2d;
        border-bottom: solid 1px #444;
        height: 250px;
    }

    .selectedMinerInfo .address{
        font-size: 10px;
    }

    .titlePool{
        margin: 0;
        padding: 0;
        font-size: 12px;
    }

    #footer{
       display: none;
    }

    #yourPoolSection{
        padding-top: 63px;
    }

    .poolContainer{
        padding-top: 25px;
    }

</style>

