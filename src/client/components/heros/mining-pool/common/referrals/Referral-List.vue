<template>

    <div class="poolSectionContainer">

        <div v-if="this.displayType==='normal'" class="poolContainer">

            <div v-for="(element, index) in this.referralData.referees" :key="'miningPoolListElement '+index"  class="miner" :class="element.active===true ? 'activeMiner' : ''"  @click="selectReferralMiner(index)">
                <img alt="picker" src="/public/assets/images/picker.png"/>
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

            <div v-for="(element, index) in this.referralData.referees" :key="'miningPoolListElement '+index" @click="selectReferralMiner(index)" class="transactionInfo referralInfo">

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Status:</span>
                    <span class="status" :class="element.online ? 'yellowText' : ''">{{element.active ? 'Mining' : 'Offline'}}</span>
                </div>

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Referral Address:</span>
                    <img class="walletListImage" :src="getWalletImage(element.address)" :title="element.address"/>
                </div>

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Miner Address:</span>
                    <img class="walletListImage" :src="getWalletImage(element.referralAddress)" :title="element.referralAddress"/>
                </div>

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Next Reward:</span>
                    <span class="time">{{getNextReward(element) }} WEBD</span>
                </div>

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Sent Reward:</span>
                    <span class="minedBy">{{getSentReward(element)}} WEBD</span>
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

        data:()=>{
            return {
                referralData: {},
            }
        },

        methods:{

            setReferralList(data){
                console.log("this.referralData",this.referralData);
                this.referralData = data;
            },

            selectReferralMiner(index){

                this.$emit('selectReferee', index);

            },

            getWalletImage(address){
                return WebDollar.Blockchain.Wallet.getAddressPic(address);
            },



            getNextReward(element){

                return (element.total - element.sent) / WebDollar.Applications.CoinsHelper.WEBD ;

            },

            getSentReward(element){

              return element.sent /   WebDollar.Applications.CoinsHelper.WEBD;

            }

        },

        computed:{


        },

        mounted(){

            if (typeof window !== "undefined") return;



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