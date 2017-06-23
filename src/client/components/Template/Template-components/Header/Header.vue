<template>
    <div class="row border-bottom">

        <TopNavbar />


        <SocketStatusBar />

    </div>
</template>

<script>
    import TopNavbar from './Top-navbar/TopNavbar.vue';

    export default{
        name: 'Layout-Header-view',

        components: {TopNavbar}

    }
</script>
