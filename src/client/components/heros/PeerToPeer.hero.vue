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

                <h1 class="alignCenter bigMarginBottom">Create your own mining pool</h1>

                <div class="distributionContainer">

                    <div class="distributionGrid">

                        <div class="verticalAlignMiddle">

                            <p class="subtitle">Set miner's reward commission</p>
                            <slider ref="refMiningSlider" @sliderChanged="this.changeCommission"/>

                            <p class="createPoolLink poolDescription">Send your invitation to friend and they will start instant mining in your pool.</p>
                            <p class="copyPoolLink" @click="copyToClipboard">
                                Copy your invitation link
                            </p>

                        </div>

                    </div>
                    <div class="distributionGrid poolDescription">

                        <div class="verticalAlignMiddle">

                            You can mine WEBD with your friends! You can create your own pool just using the follow link. You will be able to see stats about miners and to add and remove miners in your pool everytime you want. You will also being albe to set a reward commission for your miners.

                            <a href="/mypool">
                                <p class="copyPoolLink">Manage your pool</p>
                            </a>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>

</template>

<script>

    var Vue = require('vue');

    import slider from './../UI/elements/slider.vue';
    import Clipboard from './../../../../node_modules/v-clipboard';

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
            else Vue.use(Clipboard);

        }

    }

</script>