<template>

    <div>
        <div id="walletButton" @click="handleWalletButton" ref="walletButton" :style="{marginBottom: this.walletOpened ? '100px' : 0}">
            <span id="miningButtonText">
                <i :class="'fa fa-chevron-'+ (this.walletOpened ? 'down' : 'up')" style="padding-right: 10px"></i>{{this.walletText}}
            </span>
        </div>

        <div id="walletMenu" ref="walletMenu" :style="{marginBottom: this.walletOpened ? 0 : '-100px'}">

            <!--<ShowWallet v-for="wallet in this.walletAddresses"
                    :key="wallet"
                    :id="wallet"
                    :walletAddress="wallet"
                >

            </ShowWallet>-->


        </div>
    </div>

</template>

<script>

    export default{


        data() {
            return {
                walletText: "Wallet: 0.0 WEBD",
            }
        },

        computed:{
            walletOpened(){
                return this.$store.state.wallet.walletMenuStatus;
            }
        },

        mounted(){
            if (typeof window !== "undefined")  // On Client, in Browser
                this.addNewAddress();

        },

        methods: {

            handleWalletButton(){

                this.$store.dispatch('WALLET_MENU_INVERT', {})
            },


            addNewAddress(){

//                let address = WebDollar.Blockchain.Wallets.createNewAddress();
//                this.walletAddresses.push( address.getAddressAndPrivateKey().address.toBase() );
            }

        }

    }

</script>