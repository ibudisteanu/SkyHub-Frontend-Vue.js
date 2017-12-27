<template>

    <div id="header">
        <img src="public/WebDollar-logo-black.png" id="logo"/>

        <div id="menu">
            <ul>
                <li>Home</li>
                <a href="/#what-is-WebDollar"><li>What is?</li></a>
                <li @click="handleWallet">Wallet</li>
                <a href="/public/doc/WebDollar-White-Paper.pdf" target="_blank" ><li>White Paper</li></a>
                <a href="/#team"><li>Team</li></a>
                <li>Network</li>
            </ul>
        </div>
    </div>

</template>

<script>
    export default {

        name: "Header",

        methods:{

            handleWallet(){

                this.$store.dispatch('WALLET_MENU_INVERT', {})

            }

        }

    }
</script>