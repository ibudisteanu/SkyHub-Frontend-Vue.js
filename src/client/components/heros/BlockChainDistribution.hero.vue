<template>

    <div id="coinDistributionSection" class="fullSection">

        <div class="verticalAlignMiddle">

            <h1 class="alignCenter bigMarginBottom">COIN SUPPLY</h1>

            <div class="distributionContainer maxWidthSection">

                <div class="distributionGrid">
                    <div class="webdCoin spin">
                        <img src="/public/WebDollar-logo-black.png" class="coinLogo">
                    </div>
                </div>
                <div class="distributionGrid">

                    <div class="stats">
                        <div>
                            <span class="value">{{this.blocksLength}}</span>
                            <span class="description">Current Distribution</span>
                        </div>
                        <div>
                            <span class="value">0.0001</span>
                            <span class="description">USD per 1 WEBD</span>
                        </div>
                    </div>

                    <div id="myProgress">
                        <div id="myBar" ref="refDistributionProgressBar"></div>
                    </div>
                    <span class="minValue">{{this.distributionProgressBarMinString}} WEBD</span>
                    <span class="maxValue">{{this.distributionProgressBarMaxString}} WEBD</span>

                </div>

            </div>

        </div>


    </div>
</template>

<script>

    export default{

        name: "BlockchainDistribution",

        data() {
            return {
                totalAmountCoins: 0,
                blocksLength: 0,

                distributionProgressBarMax : 100000000,
                distributionProgressBarMin : 0
            }
        },

        computed:{
            distributionProgressBarMinString(){
                return this.formatMoneyNumber(this.distributionProgressBarMin, 0)
            },

            distributionProgressBarMaxString(){
                return this.formatMoneyNumber(this.distributionProgressBarMax, 0)
            }
        },

        mounted(){

            if (typeof window === "undefined") return;

            WebDollar.Blockchain.Chain.accountantTree.emitter.on("accountant-tree/root/total",(totalAmount)=>{

                this.totalAmountCoins = totalAmount;

                this.$refs['refDistributionProgressBar'].style.width = totalAmount / this.distributionProgressBarMax * 100  +'%'

            });

            WebDollar.Blockchain.Chain.emitter.on("blockchain/blocks-count-changed", (blocksLength)=>{

                this.blocksLength = blocksLength;

            })

        },

        methods:{

            formatMoneyNumber(n, decimals=2) {
                return n.toFixed(decimals).replace(/./g, function(c, i, a) {
                    return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
                });
            }

        }

    }

</script>