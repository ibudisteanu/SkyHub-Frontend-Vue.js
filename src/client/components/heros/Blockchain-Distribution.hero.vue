<template>

    <div id="coinDistributionSection" class="fullSection">

        <div class="verticalAlignMiddle">

            <h1 class="alignCenter bigMarginBottom">COIN SUPPLY</h1>

            <div class="distributionContainer maxWidthSection">

                <div class="distributionGrid">
                    <div class="webdCoin spin">
                        <img src="/public/assets/images/WebDollar-logo-black.png" alt="webDollar logo black" title="webDollar black logo" class="coinLogo">
                    </div>
                </div>
                <div class="distributionGrid">

                    <div class="stats">
                        <div>
                            <span v-show="!this.loaded" class="value">
                                 <div class="minningSpinner">
                                    <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                     width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                                      <path fill="#000" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
                                        <animateTransform attributeType="xml"
                                          attributeName="transform"
                                          type="rotate"
                                          from="0 25 25"
                                          to="360 25 25"
                                          dur="0.6s"
                                          repeatCount="indefinite"/>
                                        </path>
                                    </svg>
                                </div>
                            </span>
                            <span v-show="this.loaded" class="value">{{this.distributionAmount}}</span>
                            <span class="description">Current Distribution</span>
                        </div>
                        <div>
                            <span v-show="!this.loaded" class="value">
                                 <div class="minningSpinner">
                                    <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                     width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                                      <path fill="#000" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
                                        <animateTransform attributeType="xml"
                                          attributeName="transform"
                                          type="rotate"
                                          from="0 25 25"
                                          to="360 25 25"
                                          dur="0.6s"
                                          repeatCount="indefinite"/>
                                        </path>
                                  </svg>
                                </div>
                            </span>
                            <span v-show="this.loaded" class="value">{{this.distributionBlocks}}</span>
                            <span class="description">Mined blocks</span>
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
                return this.formatMoneyNumber(this.blocksLength*2500, 0)
            },

            distributionBlocks(){
                return this.formatMoneyNumber(this.blocksLength, 0)
            },
        },

        mounted(){

            if (typeof window === "undefined") return;

            WebDollar.Blockchain.Chain.accountantTree.emitter.on("accountant-tree/root/total",(totalAmount)=>{

                this.totalAmountCoins = totalAmount;

                this.verifyIfContainData(totalAmount);

            });

            WebDollar.StatusEvents.on("blockchain/blocks-count-changed", (blocksLength)=>{

                this.blocksLength = blocksLength;

                this.$refs['refDistributionProgressBar'].style.width = blocksLength*2500 / this.distributionProgressBarMax * 100  +'%'

            });

        },

        methods:{

            formatMoneyNumber(n, decimals=2) {
                return n.toFixed(decimals).replace(/./g, function(c, i, a) {
                    return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
                });
            },

            verifyIfContainData(amount){

                if (amount!==0)
                    this.loaded=true;
                else {
                    this.loaded = false;
                    console.error("verifyIfContainData", amount)
                }

            }

        }

    }

</script>