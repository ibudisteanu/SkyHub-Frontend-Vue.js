<template>

    <div id="p2p-network">
        <div id="networkSection">
            <div>

                <h1 class="alignCenter">Peer-to-Peer Network</h1>
                <h3 >On the following map you can see all your mining group connections in real time</h3>

                <NativeMap/>

            </div>
        </div>
    </div>

</template>

<script>

    import NativeMap from "client/components/Map/NativeMap.vue"

    export default{

        components:{
            "NativeMap":NativeMap,
        },

    }

</script>