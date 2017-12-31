<template>

    <div v-if="this.walletAddress !== null && this.walletAddress !== undefined">

        <Modal title="Wallet Adres" ref="modal">

            <div slot="content">

                <div class="twoColums">

                    <div class="section">

                        <div style="font-size: 20px">
                            Adres
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

                <form class="transfer">

                    <p class="title">Transfer WBD</p>

                    <input class="adress" placeholder="Recipient Adres"/>
                    <!--{{this.toAddress||''.toString() }}-->

                    <input class="amount" placeholder="WBD Amount"/>
                    <!--{{this.toAmount||0.0.toString() }}-->

                    <button type="submit" class="button">
                        SEND WBD
                    </button>
                </form>

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