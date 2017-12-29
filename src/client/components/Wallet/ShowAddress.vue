<template>

    <div class="walletAdress" v-if="this.walletAddress !== null && this.walletAddress !== undefined" @click="this.handleTransferFunds">

        <b>120 WBD</b>

        <TransactionModal ref="modalTransferFunds" :walletAddress="this.walletAddress" > </TransactionModal>

    </div>

</template>

<script>

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
            }

        }

    }

</script>