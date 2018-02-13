<template>
    <div class="newAlert animateOpen" >

        {{this.message}}

    </div>
</template>


<script>

    export default {
        name: 'alert',

        components: {
        },

        props: ['message'],

        data() {
            return {
            }
        },

        methods: {

        },

        mounted() {

        }
    }

</script>