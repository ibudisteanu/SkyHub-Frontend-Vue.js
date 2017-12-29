<template>

    <div>

        <div class="modal" ref="modal">
            <div class="header">
                <div class="title">
                    <slot name="title"></slot>
                </div>
                <div class="close" @click="this.closeModal">
                    x
                </div>
            </div>
            <div class="container">
                <slot name="content"></slot>
            </div>
            <div class="modalSubmit">
                Submit
            </div>
        </div>

    </div>


</template>


<script>

    export default{

        name: "Modal",

        methods:{



            closeModal(){

                document.getElementById("modalBackground").setAttribute('style', 'display:none !important');
                this.$refs['modal'].setAttribute('style', 'display:none !important');

            },

            showModal(){

                document.getElementById("modalBackground").setAttribute('style', 'display:block !important');
                document.getElementById("modalBackground").onclick=this.closeModal;
                this.$refs['modal'].setAttribute('style', 'display:block !important');

            }

        }

    }

</script>