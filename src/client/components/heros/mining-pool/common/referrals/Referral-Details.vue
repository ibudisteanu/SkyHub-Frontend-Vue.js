<template>

    <div>

        <h2>Referral Details</h2>

        <div class="selectedMinerInfo">

            <div class="minerData address addressTextBox">
                 <img v-show="this.referralLinkAddress !== ''" class="inlineBlock walletDescriptionImage" :src="getWalletImage(this.referralLinkAddress)" :title="this.referralLinkAddress"/>
                 <span class="yellowColor">{{this.referralLinkAddress||'You were not referenced by anybody'}}</span>
            </div>

            <div class="statisticsContent">

                <div class="dataStatisticsItem">
                    <span class="titlePool">Status:</span>
                    <span class="minerData">{{this.referee.online===true ? 'Mining' : 'Offline'}}</span>
                </div>

                <div class="dataStatisticsItem">
                    <span class="titlePool">Referee Address::</span>
                    <span class="minerData">
                        <img v-show="this.referee.address !== ''" class="inlineBlock" :src="getWalletImage(this.referee.address)" :title="this.referee.address"/>
                        <span class="inlineBlock" style="font-size: 10px">
                            {{this.referee.address}}
                        </span>
                    </span>
                </div>

                <div class="dataStatisticsItem">
                    <span class="titlePool">Estimated* Hash/s:</span>
                    <span class="minerData">not specified at the moment</span>
                </div>

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Potential Reward:</span>
                    <span class="minedBy">{{this.getCoins(this.referee.total)}}  WEBD</span>
                </div>

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Confirmed Reward:</span>
                    <span class="minedBy">{{this.getCoins(this.referee.confirmed)}} WEBD</span>
                </div>

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Total Reward Sent:</span>
                    <span class="minedBy">{{this.getCoins(this.referee.sent)}}  WEBD</span>
                </div>

            </div>

        </div>

    </div>

</template>

<script>

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
                return (value||0) / WebDollar.Applications.CoinsHelper.WEBD;
            }

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