<template>

    <div v-if="this.wallet !== null">

        <b>{{this.wallet.address.toString('hex')}}</b>

    </div>

</template>

<script>

    export default{

        props:{
            wallet: {default: null},
        }

    }

</script>