<template>

    <div id="p2p-network">

        <div id="networkSection">
            <div>

                <h1 class="alignCenter">Peer-to-Peer Network</h1>
                <h3 >See all your Mining Group Connections in Real-Time </h3>

                <div id="WebDollarMap"></div>

            </div>
        </div>

        <div id="createPoolSection" class="fullSection">

            <div class="verticalAlignMiddle">

                <h1 class="alignCenter bigMarginBottom">Create your own mining pool</h1>

                <div class="distributionContainer">

                    <div class="distributionGrid">

                        <p class="createPoolLink">https://webdollar.io/213tgewg23fghwej524q?12fa</p>
                        <p class="copyPoolLink">Copy link</p>

                    </div>
                    <div class="distributionGrid poolDescription">

                        You can mine WEBD with your friends! You can create your own pool just using the follow link. You will be able to see stats about miners and to add and remove miners in your pool everytime you want. You will also being albe to set a reward commission for your miners.

                        <no-ssr>
                            <slider ref="refMiningSlider" @sliderChanged="this.changeCommission"/>
                        </no-ssr>

                    </div>

                </div>

            </div>

        </div>

    </div>

</template>

<script>

    import NoSSR from './../../../../node_modules/vue-no-ssr';
    import slider from './../UI/elements/slider.vue';

    export default{

        name: 'pool',

        components: {
            'no-ssr': NoSSR,
            "slider":slider
        },

        methods: {

            changeCommission(){

            }

        }

    }

</script>