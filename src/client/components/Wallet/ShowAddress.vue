<template>

    <div v-if="this.walletAddress !== null && this.walletAddress !== undefined">

        <b>{{ this.walletAddress.address.toString() }}</b>


        <TransactionModal ref="modalTransferFunds" :walletAddress="this.walletAddress" > </TransactionModal>

        <a class="btn" @click="this.handleTransferFunds">
            <i class="fa fa-mail-forward" ></i> Transfer Funds
        </a>


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