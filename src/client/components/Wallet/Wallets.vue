<template>

    <div>
        <div id="walletButton" @click="handleWalletButton" ref="walletButton" :style="{marginBottom: this.walletOpened ? '125px' : 0}">
            <span id="miningButtonText">
                <i :class="'fa fa-chevron-'+ (this.walletOpened ? 'down' : 'up')" ></i>{{this.walletText}}
            </span>
        </div>

        <div id="walletMenu" class="twoColums" ref="walletMenu" :style="{marginBottom: this.walletOpened ? 0 : '-126px'}">

            <div id="dashboardMining" class="walletSection">

                <Mining/>

            </div>

            <div id="dashboardWallet" class="walletSection">

                <div id="createWalletAdress" @click="this.handleAddWallet">
                    <p>Create Wallet Adress</p>
                </div>
                <div id="allWalets">
                 <ShowAddress v-for="walletAddress in this.walletAddresses"

                                 :key="walletAddress.address"
                                 :id="'address'+walletAddress.address"
                                 :walletAddress="walletAddress">

                    </ShowAddress>
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

            }

        }

    }

</script>