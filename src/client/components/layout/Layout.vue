<template>

    <div>

        <HeaderLayout/>

        <div class="backgroundVideoWrap">
            <video autoplay loop class="backgroundVideo">
                <source src="public/assets/video/file.mp4" type="video/mp4">
            </video>
        </div>

        <div id="websiteBody">

            <slot name="content"></slot>

        </div>

        <Wallet/>

        <FooterLayout/>



    </div>

</template>

<script>

    import HeaderLayout from "client/components/layout/HeaderLayout.vue"
    import FooterLayout from "client/components/layout/FooterLayout.vue"

    import Wallet from "client/components/Wallet/Wallets.vue"

    export default{

        name: "Layout",

        components:{
            "HeaderLayout": HeaderLayout,
            "FooterLayout": FooterLayout,
            "Wallet": Wallet,
        }

    }


</script>