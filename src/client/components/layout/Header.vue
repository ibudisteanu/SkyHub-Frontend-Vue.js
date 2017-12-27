<template>

    <div id="header">
        <img src="public/WebDollar-logo-black.png" id="logo"/>

        <div id="menu">
            <ul>
                <li>Home</li>
                <li>About</li>
                <li onclick="walletOpenHandler()">Wallet</li>
                <li>White Papper</li>
                <li>Team</li>
                <li>Network</li>
            </ul>
        </div>
    </div>

</template>

<script>
    export default {

        name: "Header",

    }
</script>