<template>
    <div class="row">

        <TopNavbar />


        <SocketStatusBar />

    </div>
</template>

<script>
    import TopNavbar from './Top-navbar/TopNavbar.vue';
    import SocketStatusBar from './Socket-status-bar/HeaderBarSocketStatus.vue';

    export default{
        name: 'Layout-Header-view',

        components: {TopNavbar, SocketStatusBar}

    }
</script>
