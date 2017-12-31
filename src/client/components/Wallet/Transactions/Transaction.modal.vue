<template>

    <div v-if="this.walletAddress !== null && this.walletAddress !== undefined">
        <Modal title="Send Funds" ref="modal">
            <div slot="content">

                <div class="row" style="padding-bottom: 50px">
                    <div class="col-md-6">

                        <b style="color:gray">Address</b><br/>
                        <div style="word-wrap:break-word;">
                            {{this.walletAddress.address.toString()}}
                        </div>
                    </div>

                    <div class="col-md-6">
                        <b style="color:gray">Balance</b> <br/>

                        <div style="font-size: 20px">
                            0.0 WBD
                        </div>

                    </div>
                </div>

                <div class="row">

                    Transfer To: <br/>

                    {{this.toAddress||''.toString() }}

                </div>

                <div class="row">

                    Amount: <br/>

                    {{this.toAmount||0.0.toString() }}

                </div>


            </div>
        </Modal>
    </div>

</template>

<script>

    import Modal from "client/components/UI/modals/Modal.vue"

    export default{

        props:{

            walletAddress: {default: null},
            toAddress: {default: null},
            toAmount: {default: 0.0},

        },

        components:{

            "Modal":Modal,

        },

        methods:{

            closeModal(){
                this.$refs['modal'].closeModal();
            },

            showModal(){
                this.$refs['modal'].showModal();
            },

        }

    }

</script>