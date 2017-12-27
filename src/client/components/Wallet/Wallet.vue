<template>

    <div>
        <div id="walletButton" @click="handleWallet" ref="walletButton">
            <span id="miningButtonText">
                {{this.walletText}}
            </span>
        </div>

        <div id="walletMenu" ref="walletMenu">
        </div>
    </div>

</template>

<script>

    export default{


        data() {
            return {
                walletText: "Wallet: 0.0 WEBD",
                walletOpened: false,
            }
        },

        methods: {

            openWallet() {

                this.$refs["walletButton"].style.marginBottom = "100px";
                this.$refs["walletMenu"].style.marginBottom = "0";

            },

            closeWallet() {

                this.$refs["walletMenu"].style.marginBottom = "-100px";
                this.$refs["walletButton"].style.marginBottom = "0";
            },

            handleWallet(){

                if(this.walletOpened)
                    this.closeWallet();
                else
                    this.openWallet();


                this.walletOpened = !this.walletOpened;
            }
        }

    }

</script>