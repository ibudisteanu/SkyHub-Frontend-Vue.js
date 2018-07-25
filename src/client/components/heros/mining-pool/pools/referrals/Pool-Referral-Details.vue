<template>

    <div>

        <h2>Referral Details</h2>

        <div class="selectedMinerInfo">

            <div class="minerData address addressTextBox">
                 <img class="inlineBlock walletDescriptionImage" :src="getWalletImage(this.miner.refereeAddress)" :title="this.miner.refereeAddress"/>
                 <span class="yellowColor">{{this.miner.refereeMiner}}</span>
            </div>

            <div class="statisticsContent">

                <div class="dataStatisticsItem">
                    <span class="titlePool">Status:</span>
                    <span class="minerData">{{this.miner.active===true ? 'Mining' : 'Offline'}}</span>
                </div>

                <div class="dataStatisticsItem">
                    <span class="titlePool">Referral Address::</span>
                    <span class="minerData">
                        <img class="inlineBlock" :src="getWalletImage(this.miner.refereeAddress)" :title="this.miner.refereeAddress"/>
                        <span class="inlineBlock">
                            {{this.miner.refereeAddress}}
                        </span>
                    </span>
                </div>

                <div class="dataStatisticsItem">
                    <span class="titlePool">Hash/s:</span>
                    <span class="minerData">{{this.miner.hashs}}</span>
                </div>

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Next Reward:</span>
                    <span class="minedBy">{{this.miner._rewardReferralTotal}}</span>
                </div>

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Total Reward:</span>
                    <span class="minedBy">{{this.miner._rewardReferralSent}}</span>
                </div>

            </div>

        </div>

    </div>

</template>

<script>

    export default{

        props: {
            miner: {default: 'object'},
        },

        data:()=>{
            return {

            }
        },

        mounted(){

            if (typeof window === "undefined") return;


        },

        methods: {

            getWalletImage(address){
                return WebDollar.Blockchain.Wallet.getAddressPic(address);
            },

        },

    }

</script>

<style>

    .addressTextBox{
        background-color: #2d2d2d;
        width: 100%;
        border-top: solid 1px #444;
        border-bottom: solid 1px #444;
        text-align: center;
    }

    .dataStatisticsItem{
        display: grid;
        border-top:solid 1px #3e3e3e;
        grid-template-columns: 150px 1fr;
    }

    .dataStatisticsItem:last-child{
        border-bottom:solid 1px #3e3e3e;
    }

    .dataStatisticsItem span{
        width: 100%;
    }

    .dataStatisticsItem .minerData{
        text-align: right;
    }

    .statisticsContent{
        display: block;
        padding: 20px 10px 0 10px;
        overflow-y: scroll;
    }

</style>