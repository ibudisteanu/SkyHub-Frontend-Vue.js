<template>

    <div v-if="this.referee.address!==''">

        <div class="selectedMinerInfo">

            <div class="minerData address addressTextBox">
                 <img class="inlineBlock walletDescriptionImage" :src="getWalletImage(this.referee.address)" :title="this.referee.address"/>
                 <span class="specialYellowColor"> {{this.referee.address}} </span>
            </div>

            <div class="statisticsContent">

                <div class="dataStatisticsItem">
                    <span class="titlePool">Status:</span>
                    <span class="minerData">{{this.referee.online===true ? 'Mining' : 'Offline'}}</span>
                </div>

                <div class="dataStatisticsItem">
                    <span class="titlePool">Hash/s:</span>
                    <span class="minerData">not specified at the moment</span>
                </div>

                <div class="dataStatisticsItem">
                    <span class="titlePool">Potential Reward:</span>
                    <span class="minerData">{{this.getCoins(this.referee.total)}}  WEBD</span>
                </div>

                <div class="dataStatisticsItem">
                    <span class="titlePool">Confirmed Reward:</span>
                    <span class="minerData">{{this.getCoins(this.referee.confirmed)}} WEBD</span>
                </div>

                <div class="dataStatisticsItem">
                    <span class="titlePool">Total Reward Sent:</span>
                    <span class="minerData">{{this.getCoins(this.referee.sent)}}  WEBD</span>
                </div>

            </div>

        </div>

    </div>

</template>

<script>

    import Utils from 'src/utils/util-functions'

    export default{

        props: {

        },

        data:()=>{
            return {
                referralLinkAddress: '',
                referralLinkAddressOnline: undefined,
                referee:{
                    address:'',
                    sent:0,
                    confirmed: 0,
                    total: 0,
                },
            }
        },

        mounted(){

            if (typeof window === "undefined") return;

        },

        methods: {

            getWalletImage(address){
                return WebDollar.Blockchain.Wallet.getAddressPic(address||'');
            },

            setReferee(miner){

                this.referee = miner;

            },

            setReferralLinkAddress(referralLinkAddress, referralLinkAddressOnline ){

                this.referralLinkAddress = referralLinkAddress||'';
                this.referralLinkAddressOnline = referralLinkAddressOnline;

            },

            getCoins(value){
                return Utils.formatMoneyNumber(value,2);
            },

        },

    }

</script>

<style>

    .addressTextBox{
        background-color: #2d2d2d;
        width: 100%;
        border-top: solid 1px #444;
        text-align: center;
    }

    .dataStatisticsItem{
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
        padding: 0 0 0 10px;
        overflow-y: scroll;
    }

    .minerData span{
        width: 100%;
    }

    .statisticsContent .dataStatisticsItem{
        display: grid;
        grid-template-columns: 40% 1fr;
    }

    .specialYellowColor{
        color: #ffeec4;
    }

</style>