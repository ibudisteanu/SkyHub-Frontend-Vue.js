<template>

    <div id="coinDistributionSection" class="fullSection">

        <div class="verticalAlignMiddle">

            <span class="pageTitle alignCenter bigMarginBottom">COIN SUPPLY</span>

            <div class="distributionContainer maxWidthSection">

                <div class="distributionGrid">
                    <div class="webdCoin spin">
                        <img src="/public/assets/images/logo-coin.png" alt="webDollar logo black" title="webDollar black logo" class="coinLogo">
                    </div>
                </div>
                <div class="distributionGrid">

                    <div class="stats">
                        <div>
                            <span v-show="!this.loaded" class="value">
                                <loading-spinner />
                            </span>
                            <span v-show="this.loaded" class="value">{{this.distributionAmount}}</span>
                            <span class="description">Current Distribution</span>
                        </div>
                        <div>
                            <span v-show="!this.loaded" class="value">
                                 <loading-spinner />
                            </span>
                            <span v-show="this.loaded" class="value">{{this.distributionBlocks}}</span>
                            <span class="description">Mined blocks</span>
                        </div>
                    </div>

                    <div id="myProgress">
                        <div id="myBar" :style="{width: blocksLength*3000 / this.distributionProgressBarMax * 100  + '%' }"></div>
                    </div>
                    <span class="minValue">{{this.distributionProgressBarMinString}} WEBD</span>
                    <span class="maxValue">{{this.distributionProgressBarMaxString}} WEBD</span>

                </div>

            </div>

        </div>

    </div>
</template>

<script>

    import LoadingSpinner from "client/components/UI/elements/Loading-Spinner.vue"

    export default{

        name: "BlockchainDistribution",

        components:{
            LoadingSpinner,
        },

        data() {
            return {
                totalAmountCoins: 0,
                blocksLength: 0,
                loaded:false,

                distributionProgressBarMax : 1000000000,
                distributionProgressBarMin : 0
            }
        },

        computed:{
            distributionProgressBarMinString(){
                return this.formatMoneyNumber(this.distributionProgressBarMin, 0)
            },

            distributionProgressBarMaxString(){
                return this.formatMoneyNumber(this.distributionProgressBarMax, 0)
            },
            distributionAmount(){
                return this.formatMoneyNumber(this.blocksLength*3000, 0)
            },

            distributionBlocks(){
                return this.formatMoneyNumber(this.blocksLength, 0)
            },
        },

        mounted(){

            if (typeof window === "undefined") return;

            if (WebDollar.Blockchain.synchronized){

                this.verifyIfContainData(WebDollar.Blockchain.Chain.accountantTree.calculateNodeCoins());

                this.blocksLength = WebDollar.Blockchain.Chain.blocks.length;

            }


            WebDollar.Blockchain.Chain.accountantTree.emitter.on("accountant-tree/root/total",(totalAmount)=>{

                this.verifyIfContainData(totalAmount);

            });

            WebDollar.StatusEvents.on("blockchain/blocks-count-changed", (blocksLength)=>{

                this.blocksLength = blocksLength;

            });

        },

        methods:{

            formatMoneyNumber(n, decimals=2) {
                return n.toFixed(decimals).replace(/./g, function(c, i, a) {
                    return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
                });
            },

            verifyIfContainData(amount){

                this.totalAmountCoins = amount;

                if (amount!==0)
                    this.loaded=true;
                else
                    this.loaded = false;

            }

        }

    }

</script>