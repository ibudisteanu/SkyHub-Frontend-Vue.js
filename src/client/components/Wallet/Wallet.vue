<template>

    <div>
        <div id="walletButton" @click="handleWallet" ref="walletButton" :style="{marginBottom: this.walletOpened ? '100px' : 0}">
            <span id="miningButtonText">
                <i :class="'fa fa-chevron-'+ (this.walletOpened ? 'down' : 'up')" style="padding-right: 10px"></i>{{this.walletText}}
            </span>
        </div>

        <div id="walletMenu" ref="walletMenu" :style="{marginBottom: this.walletOpened ? 0 : '-100px'}">
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

        methods: {

            handleWallet(){

                this.$store.dispatch('WALLET_MENU_INVERT', {})
            }
        }

    }

</script>