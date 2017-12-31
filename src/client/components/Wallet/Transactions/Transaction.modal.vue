<template>

    <div v-if="this.walletAddress !== null && this.walletAddress !== undefined">

        <Modal title="Wallet Adress" ref="modal">

            <div slot="content" class="twoColums">

                <div class="section">

                    <div style="font-size: 20px">
                        Adress
                    </div>

                    <b style="color:gray" id="walletID">{{this.walletAddress.address.toString()}}</b>

                    <div class="copyToClipboard" @click="this.copyToClipboard()">
                        Copy to Clipboard
                    </div>

                </div>

                <div class="section">

                    <div style="font-size: 20px">
                        Balance
                    </div>

                    <b class="ballance" style="color:gray">0.0 WEBD</b>

                </div>

            </div>
            <div class="transfer">
                <div >

                    Transfer To: <br/>

                    {{this.toAddress||''.toString() }}

                </div>

                <div >

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

            copyToClipboard(){
                var copyText = document.getElementById("walletID").innerHTML;
                copyText.select();
                document.execCommand("Copy");
                alert("Copied the text: " + copyText.value);
            }

        }

    }

</script>