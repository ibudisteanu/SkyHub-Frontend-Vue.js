<template>

    <div id="header">
        <img src="public/WebDollar-logo-black.png" id="logo"/>

        <div id="menu">
            <ul>
                <li>Home</li>
                <a  class="anchor" href="/#what-is-WebDollar"><li>What is?</li></a>
                <li @click="handleWallet">Wallet</li>
                <a  href="/public/doc/WebDollar-White-Paper.pdf" target="_blank" ><li>White Paper</li></a>
                <a class="anchor"href="/#team"><li>Team</li></a>
                <a class="anchor"href="/#p2p-network"><li>Network</li></a>
            </ul>
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