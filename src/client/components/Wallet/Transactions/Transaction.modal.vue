<template>

    <Modal title="Send Funds" ref="modal">
        <div slot="content">

            <div class="row">
                <div class="col-md-6">
                    Hello World
                </div>

                <div class="col-md-6">
                    Hello World2
                </div>
            </div>


        </div>
    </Modal>

</template>

<script>

    import Modal from "client/components/UI/modals/Modal.vue"

    export default{

        props:{

            wallet: {default: null},
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