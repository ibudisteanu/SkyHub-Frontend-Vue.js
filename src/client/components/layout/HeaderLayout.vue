<template>

    <div id="header">
        <!--<img src="public/WebDollar-logo-black.png" id="logo"/>-->

        <div class="topnav" id="menu">
            <a href="#mainSection" class="active" id="logoMenu"><img src="public/WebDollar-logo-black.png" id="logo"/></a>

            <a href="#team">Team</a>
            <a href="#p2p-network">Network</a>
            <a href="#timelineSection">Timeline</a>
            <a href="/public/doc/WebDollar-White-Paper.pdf" target="_blank">White Paper</a>
            <a href="#what-is-WebDollar">What is?</a>

            <a href="javascript:void(0);" style="font-size:15px;" class="icon showMenu" onclick="showMobileMenu()">&#9776;</a>
        </div>



    </div>

</template>

<script>
    export default {

        name: "HeaderLayout",

        methods:{

            handleWallet(){

                this.$store.dispatch('WALLET_MENU_INVERT', {})

            }

        }

    }
</script>