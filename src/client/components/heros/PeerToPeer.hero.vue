<template>

    <div id="p2p-network">

        <div id="networkSection">
            <div>

                <h1 class="alignCenter">Peer-to-Peer Network</h1>
                <h3 >See all your Mining Group Connections in Real-Time </h3>

                <div id="WebDollarMap"></div>

            </div>
        </div>

        <div id="createPoolSection">

            <div class="">

                <h1 class="alignCenter bigMarginBottom">CREATE YOUR OWN MINING POOLl</h1>

                <div class="distributionContainer">

                    <div class="distributionGrid">

                        <div class="verticalAlignMiddle">

                            <p class="subtitle">Set miner's reward commission</p>
                            <slider ref="refMiningSlider" @sliderChanged="this.changeCommission"/>

                            <p class="createPoolLink">Mine WEBD with your friends! Create your own Mining Pool now. See your Mining Pool stats in real-time by using the Button below.</p>

                            <a href="/mypool">
                                <p class="copyPoolLink">Manage your pool</p>
                            </a>

                        </div>

                    </div>
                    <div class="distributionGrid poolDescription">

                        <div class="verticalAlignMiddle">

                            <p class="poolDescription">Send an invite to a friend and they can start mining instantly in your pool.</p>
                            <p class="copyPoolLink" @click="copyToClipboard">
                                Copy invite link
                            </p>


                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>

</template>

<script>

    import Vue from 'vue/dist/vue';

    import slider from './../UI/elements/slider.vue';
    import Clipboard from 'v-clipboard';

    export default{

        name: 'pool',

        data: () => {
            return {

            }
        },

        components: {
            "slider":slider
        },

        methods: {

            changeCommission(){

            },

            copyToClipboard(){
                this.$clipboard('test-link');
            }

        },

        mounted() {

            if (typeof window === 'undefined') return;


            Vue.use(Clipboard);

        }

    }

</script>