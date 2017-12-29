<template>

    <div>
        <div id="walletButton" @click="handleWalletButton" ref="walletButton" :style="{marginBottom: this.walletOpened ? '125px' : 0}">
            <span id="miningButtonText">
                <i :class="'fa fa-chevron-'+ (this.walletOpened ? 'down' : 'up')" ></i>{{this.walletText}}
            </span>
        </div>

        <div id="walletMenu" class="twoColums" ref="walletMenu" :style="{marginBottom: this.walletOpened ? 0 : '-126px'}">

                <div id="dashboardMining" class="walletSection" >

                    <div style="text-align: center">
                        <b>Mining</b>
                    </div>

                    <Mining/>
                </div>

                <div id="dashboardWallet" class="walletSection" >

                    <div style="text-align: center">
                        <b>Wallets</b>
                    </div>

                    <div class="row">

                        <div class="col-md-2">
                            <a class="btn" @click="this.handleAddWallet">
                                <i class="fa fa-plus" ></i>
                            </a> <br/>

                            <a class="btn" >
                                <i class="fa fa-unlock" ></i>
                            </a>
                        </div>

                        <div class="col-md-10">
                            <div id="allWalets">
                                <ShowAddress v-for="walletAddress in this.walletAddresses"

                                             :key="walletAddress.address"
                                             :id="'address'+walletAddress.address"
                                             :walletAddress="walletAddress"
                                             style="padding-right: 20px"

                                >

                                </ShowAddress>
                            </div>
                        </div>
                    </div>


                </div>


        </div>
    </div>

</template>

<script>

    import ShowAddress from "./ShowAddress.vue"
    import Mining from "client/components/Mining/Mining.vue"

    export default{

        components:{
            "ShowAddress": ShowAddress,
            "Mining" : Mining,
        },

        data() {
            return {
                walletText: "Wallet: 0.0 WEBD",
            }
        },

        computed:{
            walletOpened(){
                return this.$store.state.wallet.walletMenuStatus;
            },

            walletAddresses(){
                return this.$store.getters.getWalletAddresses;
            }

        },

        mounted(){
            if (typeof window !== "undefined")  // On Client, in Browser
                this.handleAddWallet();

        },

        methods: {

            handleWalletButton(){

                this.$store.dispatch('WALLET_MENU_INVERT', {})

            },


            handleAddWallet(){

                if (typeof window === "undefined") return;  // On Client, in Browser

                this.$store.dispatch('WALLET_CREATE_NEW_ADDRESS', {})

            },



        }

    }

</script>