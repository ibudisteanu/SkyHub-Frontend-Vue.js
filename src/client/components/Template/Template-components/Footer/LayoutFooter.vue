<template>
    <div>
        <div class="footer" :style="{ zIndex:200, marginLeft:0, position: 'inherit' }">

        <div :style="{textAlign: 'right' }">

            <router-link to="/" class="item-footer-menu">Home</router-link>
            <router-link to="/about" class="item-footer-menu">About</router-link>
            <router-link to="/contact" class="item-footer-menu">Contact</router-link>


        </div>

        <div :style="{textAlign: 'center' }">
            <strong>No Copyright</strong> WebDollar is a open-source - decentralized p2p protocol.
        </div>

        </div>
    </div>
</template>


<script>
    export default {
        name: 'layout-footer-view',
    }
</script>

<style lang="stylus">
    .item-footer-menu{
        padding-right 15px;
    }
    .item-footer-menu-active{
        font-weight 80
    }
</style>