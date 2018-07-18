<template>

    <div class="poolSectionContainer">

        <div v-if="this.displayType==='normal'" class="poolContainer">

            <div v-for="(element, index) in this.minersList" :key="'miningPoolListElement '+index"  class="miner" :class="element.active===true ? 'activeMinner' : ''"  @click="selectMiner(index)">
                <img alt="picker" src="public/assets/images/picker.png"/>
                <span class="status">{{element.active===true ? 'Mining' : 'Offline'}}</span>
            </div>

        </div>

        <div v-if="this.displayType==='list'" class="list">

            <div class="transactionInfo referralInfo tableHeader">

                <span>Status</span>
                <span>Referral Address</span>
                <span>Miner Address</span>
                <span>Next Reward</span>
                <span>Total Reward</span>

            </div>

            <div v-for="(element, index) in this.minersList" :key="'miningPoolListElement '+index" @click="selectMiner(index)" class="transactionInfo referralInfo">

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Status:</span>
                    <span class="status" :class="element.active===true ? 'yellowText' : ''">{{element.active===true ? 'Mining' : 'Offline'}}</span>
                </div>

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Referral Address:</span>
                    <span class="size yellowText">{{this.getWalletImage(element.refereeAddress)}}</span>
                </div>

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Miner Address:</span>
                    <span class="size yellowText">{{this.getWalletImage(element.refereeMiner)}}</span>
                </div>

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Next Reward:</span>
                    <span class="time">{{this.getNextReward(element) -  + ' WEBD'}}</span>
                </div>

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Total Reward:</span>
                    <span class="minedBy">{{element._rewardReferralSent}}</span>
                </div>

            </div>

        </div>

    </div>

</template>

<script>

    export default{

        props: {
            displayType: {default: 'list'},
        },

        methods:{

            selectMiner(index){

                this.$emit('selectMiner', index);

            }

        },

        data(){

            return{
                referrals:[],
            }

        },

        beforeDestroy(){


        },

        methods:{

            loadPoolReferralStatistics(){

            },

            getNextReward(element){

                return (element._rewardReferralTotal + element._rewardReferralConfirmed) - element.this._rewardReferralSent;

            }

        },

        mounted(){

            if (typeof window !== "undefined") return;

            WebDollar.StatusEvents.on("miner-pool/status", data => this.loadPoolReferralStatistics() );

        }

    }

</script>

<style>

    .miner{
        transition: none;
    }

    .referralInfo{
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }

</style>