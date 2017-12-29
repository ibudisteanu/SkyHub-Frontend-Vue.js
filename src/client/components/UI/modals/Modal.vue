<template>

    <div>

        <div ref="modalBackground" class="modalBackground" >
        </div>

        <div class="modal" ref="modal">
            <div class="header">
                <div class="title">

                </div>
                <div class="close" @click="this.closeModal">
                    x
                </div>
            </div>
            <div class="container">
                text sample
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

                this.$refs['modalBackground'].setAttribute('style', 'display:none !important');
                this.$refs['modal'].setAttribute('style', 'display:none !important');

            },

            showModal(){

                console.log("hello world");

                this.$refs['modalBackground'].setAttribute('style', 'display:block !important');
                this.$refs['modal'].setAttribute('style', 'display:block !important');

            }

        }

    }

</script>