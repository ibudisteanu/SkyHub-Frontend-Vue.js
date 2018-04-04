<template>

    <Div>

        <div id="miningPoolController">

            <div class="generalController">

                <h2>Miner's commission</h2>

                <slider ref="refMiningSlider" @sliderChanged="this.changeCommission"/>

                <p class="copyPoolLink" @click="copyToClipboard">
                    Copy invite link
                </p>

            </div>

            <h2>Selected miner statistics</h2>

            <div class="selectedMinerInfo">

                <p>Adress: <span class="minerData">43t1431hg2qfwwqDSADSAD</span></p>

                <p>Miner reward for today: <span class="minerData">24 WEBD</span></p>

                <p>Miner reward from your pool: <span class="minerData">512 WEBD</span></p>

                <p>Total hours mined: <span class="minerData">24h</span></p>

                <p>Arability mining percentage: <span class="minerData">90%</span></p>

                <p>Mining power: <span class="minerData">5 Threads</span></p>

                <p>Hash/s: <span class="minerData">~ 800</span></p>

            </div>

        </div>

        <div id="yourPoolSection">

            <div class="poolSectionContainer">

                <span class="disclaimer"><span class="attention">ATTENTION!</span> This page is just a mock up for mining pool management system.</span>

                <div class="poolContainer">

                    <div class="miner">
                        <img alt="picker" src="/public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner activeMinner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Mining</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner activeMinner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Mining</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>

                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner activeMinner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Mining</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>

                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner activeMinner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Mining</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner activeMinner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Mining</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>

                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner activeMinner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner activeMinner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Mining</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Mining</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner activeMinner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>

                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner activeMinner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Mining</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner activeMinner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Mining</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>
                    <div class="miner">
                        <img alt="picker" src="public/assets/images/picker.png"/>
                        <span class="status">Offline</span>
                    </div>

                </div>

            </div>

        </div>

    </Div>
    
</template>

<script>

    import Vue from 'vue/dist/vue';

    import slider from '../UI/elements/Slider.vue';
    import Clipboard from 'v-clipboard';

    export default{

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

