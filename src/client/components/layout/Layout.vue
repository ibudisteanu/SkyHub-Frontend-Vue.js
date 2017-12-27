<template>

    <div>

        <Header/>

        <div class="backgroundVideoWrap">
            <video autoplay loop class="backgroundVideo">
                <source src="public/assets/video/file.mp4" type="video/mp4">
            </video>
        </div>

        <div id="websiteBody">

            <slot name="content"></slot>

        </div>

        <Footer/>

        <div id="miningButton" onclick="walletOpenHandler()" >
            <span id="miningButtonText">
                Wallet 0.0 WEBD
            </span>
        </div>

        <div id="miningMenu">
        </div>

    </div>

</template>

<script>

    import Header from "client/components/layout/Header.vue"
    import Footer from "client/components/layout/Footer.vue"

    export default{

        name: "Layout",

        components:{
            "Header": Header,
            "Footer": Footer,
        }

    }


</script>