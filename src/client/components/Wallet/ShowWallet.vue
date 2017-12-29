<template>

    <div v-if="this.wallet !== null">

        <b>{{this.wallet.address.toString('hex')}}</b>


        <TransactionModal ref="modalTransferFunds" :wallet="this.wallet" > </TransactionModal>

        <a class="btn" @click="this.handleTransferFunds">
            <i class="fa fa-mail-forward" ></i> Transfer Funds
        </a>


    </div>

</template>

<script>

    import TransactionModal from "./Transactions/Transaction.modal.vue"

    export default{

        props:{
            wallet: {default: null},
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