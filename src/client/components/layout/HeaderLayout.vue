<template>

    <div id="header">
        <!--<img src="public/WebDollar-logo-black.png" id="logo"/>-->

        <div class="topnav" id="menu">
            <!--<ul>-->
                <!--<li>Home</li>-->
                <!--<a  class="anchor" href="/#what-is-WebDollar"><li>What is?</li></a>-->
                <!--<li @click="handleWallet">Wallet</li>-->
                <!--<a  href="/public/doc/WebDollar-White-Paper.pdf" target="_blank" ><li>White Paper</li></a>-->
                <!--<a class="anchor"href="/#team"><li>Team</li></a>-->
                <!--<a class="anchor"href="/#p2p-network"><li>Network</li></a>-->
            <!--</ul>-->
            <a href="#home" class="active" id="logoMenu"><img src="public/WebDollar-logo-black.png" id="logo"/></a>
            <a href="#news">News</a>
            <a href="#contact">Contact</a>
            <a href="#about">About</a>
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