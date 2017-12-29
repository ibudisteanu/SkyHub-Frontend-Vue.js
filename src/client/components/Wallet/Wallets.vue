<template>

    <div>
        <div id="walletButton" @click="handleWalletButton" ref="walletButton" :style="{marginBottom: this.walletOpened ? '100px' : 0}">
            <span id="miningButtonText">
                <i :class="'fa fa-chevron-'+ (this.walletOpened ? 'down' : 'up')" ></i>{{this.walletText}}
            </span>
        </div>

        <div id="walletMenu" ref="walletMenu" :style="{marginBottom: this.walletOpened ? 0 : '-100px'}">

            <button @click="this.handleAddWallet" >Create Wallet</button>

            <div>
                <ShowWallet v-for="wallet in this.wallets"

                        :key="wallet"
                        :id="wallet.address"
                        :wallet="wallet">

                </ShowWallet>

                <Mining/>

            </div>


        </div>
    </div>

</template>

<script>

    import ShowWallet from "./ShowWallet.vue"
    import Mining from "client/components/Mining/Mining.vue"

    export default{

        components:{
            "ShowWallet": ShowWallet,
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

            wallets(){
                return this.$store.getters.getWallets;
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

            }

        }

    }

</script>