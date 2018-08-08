<template>

    <div class="poolSectionContainer">

        <div v-if="this.referralData.referees">

            <div v-if="this.displayType==='normal'" class="poolContainer">

                <div v-for="(element, index) in this.referralData.referees" :key="'miningPoolListElement '+index"  class="miner" :class="element.online===true ? 'activeMiner' : ''"  @click="selectReferralMiner(index)">
                    <img class="walletListImage normalListImage" :src="getWalletImage(element.address)" :title="element.address"/>
                    <span class="status">{{element.online===true ? 'Mining' : 'Offline'}}</span>
                </div>

            </div>

            <div v-if="this.displayType==='list'" class="list">

                <div class="transactionInfo referralInfo tableHeader">

                    <span>Status</span>
                    <span>Miner Address</span>
                    <span>Next Reward</span>
                    <span>Total Reward</span>

                </div>

                <div v-for="(element, index) in this.referralData.referees" :key="'miningPoolListElement '+index" @click="selectReferralMiner(index)" class="transactionInfo referralInfo">

                    <div class="mobileTableShow">
                        <span class="mobileTableShowTitle">Status:</span>
                        <span class="status" :class="element.online ? 'yellowText' : ''">{{element.online ? 'Mining' : 'Offline'}}</span>
                    </div>

                    <div class="mobileTableShow showOnlyOnMobile">
                        <span class="mobileTableShowTitle">Address Icon:</span>
                        <img class="walletListImage" :src="getWalletImage(element.address)" :title="element.address"/>
                    </div>

                    <div class="mobileTableShow addressOnMobile">
                        <span class="mobileTableShowTitle">Miner Address:</span>
                        <img class="walletListImage" :src="getWalletImage(element.address)" :title="element.address"/>
                        <span class="smallFontAddress">{{element.address}}</span>
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

        <div v-if="this.referralData.referees === undefined">

            <span class="warningTitle">You don't have referrals yet</span>
            <span> You can earn WEBD only by inviting your friends to mine in the current selected pool. </span>

            <p class="copyPoolLink buttonReff" @click="copyToClipboard">
                Copy Referral Link
            </p>

        </div>

    </div>

</template>

<script>

    import Vue from 'vue/dist/vue';
    import Clipboard from 'v-clipboard';
    import Utils from 'src/utils/util-functions'

    Vue.use(Clipboard);

    export default{

        props: {
            displayType: {default: 'list'},
            poolURLReferral: {default: ''},
        },

        data:()=>{
            return {
                referralData: {},
            }
        },

        methods:{

            async setReferralList(data){
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

                return Utils.formatMoneyNumber(element.total,2);

            },

            getSentReward(element){

              return Utils.formatMoneyNumber(element.sent);

            },

            copyToClipboard(){
                this.$clipboard(this.poolURLReferral);
            },

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
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    .normalListImage{
        display: block!important;
        margin-left: 16px;
        margin-top: 15px;
    }

    .miner .status{
        margin-top: 0;
        line-height: 2;
        margin-top: 0!important;
    }

    .warningTitle{
        margin: 50px 0 10px 0;
        font-size: 24px;
        text-align: center;
        text-transform: uppercase;
        width: 100%;
    }

    .buttonReff{
        margin-top: 50px;
    }

</style>