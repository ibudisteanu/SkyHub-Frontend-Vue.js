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

                    <h1 class="alignCenter bigMarginBottom">CREATE YOUR OWN MINING POOL</h1>

                    <div class="distributionContainer">

                        <div class="distributionGrid">

                            <div class="verticalAlignMiddle">

                                <p class="subtitle">SET POOL LEADER FEE REWARD</p>
                                <slider ref="refMiningSlider" @sliderChanged="this.changeCommission"/>

                                <p class="createPoolLink">Mine WEBD with your friends! Create your own Mining Pool now, by using the Button below. See your Mining Pool stats in real-time.</p>

                                <router-link to="/mypool" >
                                    <p class="copyPoolLink">My mining pool</p>
                                </router-link>

                            </div>

                        </div>
                        <div class="distributionGrid poolDescription">

                            <div class="verticalAlignMiddle">

                                <p class="poolDescription">Invite friends to start mining in your pool, instantly</p>
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

    import slider from '../UI/elements/Slider.vue';
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