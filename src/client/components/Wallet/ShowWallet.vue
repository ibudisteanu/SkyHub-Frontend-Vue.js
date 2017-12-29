<template>

    <div v-if="this.wallet !== null">

        <b>{{this.wallet.address.toString('hex')}}</b>


        <Modal ref="modalTransferFunds" :wallet="this.wallet" />

        <a class="btn" @click="this.handleTransferFunds">
            <i class="fa fa-mail-forward" ></i> Transfer Funds
        </a>


    </div>

</template>

<script>

    import Modal from "client/components/UI/modals/Modal.vue"

    export default{

        props:{
            wallet: {default: null},
        },

        components:{
            "Modal":Modal,
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