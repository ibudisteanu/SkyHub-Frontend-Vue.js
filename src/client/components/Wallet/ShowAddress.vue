<template>

    <div class="<!--walletAdress-->" v-if="this.walletAddress !== null && this.walletAddress !== undefined" @click="this.handleTransferFunds">

        <img :src="'https://www.gravatar.com/avatar/'+this.md5(this.walletAddress.address)+'?d=wavatar&f=y'" style="height: 70px"> <br/>

        <b>0.0 WEBD</b>

        <TransactionModal ref="modalTransferFunds" :walletAddress="this.walletAddress" > </TransactionModal>

        <!--<a class="btn" @click="this.handleTransferFunds">-->
            <!--<i class="fa fa-mail-forward" ></i>-->
        <!--</a>-->



    </div>

</template>

<script>

    let md5 = require('md5');

    import TransactionModal from "./Transactions/Transaction.modal.vue"

    export default{

        props:{
            walletAddress: {default: null},
        },

        components:{
            "TransactionModal":TransactionModal,
        },

        methods: {

            handleTransferFunds(){
                console.log("hoppa");
                console.log(this.$refs['modalTransferFunds']);
                this.$refs['modalTransferFunds'].showModal();
            },

            md5(input){
                return md5(input);
            }

        }

    }

</script>