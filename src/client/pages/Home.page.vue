<template>

    <Layout>

        <div slot="content">

            <div id="mainSection" class="fullSection">
                <div class="verticalAlignMiddle alignCenter">

                    <h1>Web Dollar</h1>
                    <h3>Currency of the Internet</h3>

                </div>
            </div>

            <div id="aboutSection" class="fullSection">
                <div class="verticalAlignMiddle">

                    <h1 class="alignCenter titleMarginBottom">What is WebDollar?</h1>
                    <div id="whatContainer">
                        <div>
                            <img src="public/assets/images/WebDollar-ming.jpg">
                            <h4>Start Mining in Browser in 5 sec</h4>
                            <p>You can start mining WebDollar in just 5 seconds</p>
                        </div>
                        <div>
                            <img src="public/assets/images/WebDollar-Browser.jpg">
                            <h4>Web Coin of the Internet in Browser</h4>
                            <p>WebDollar is the first Blockchain running fully in the Browser</p>
                        </div>
                        <div>
                            <img src="public/assets/images/WebDollar-wallet.jpg">
                            <h4>Easiest Blockchain for Web Payments</h4>
                            <p>Easiest Blockchain Integration for Web Payments</p>
                        </div>
                    </div>

                </div>
            </div>

            <div id="networkSection" class="fullSection">
                <div class="verticalAlignMiddle fullHeight">

                    <h2 class="alignCenter">Peer-to-Peer Network</h2>
                    <div id="map"></div>

                </div>
            </div>

            <Team/>


        </div>

    </Layout>

</template>


<script>

    import Layout from "client/components/layout/Layout.vue"
    import Team from "client/components/heros/Team.vue"

    export default {

        name: "ViewHome",

        components:{
            "Layout": Layout,
            "Team": Team,
        }

    }

</script>