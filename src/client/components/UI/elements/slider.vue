<template>
    <div class="poolSlider" >
        <vueSlider id="miningWorkersSlider" class="miningSlider" ref="slider" :piecewise="false"
                    tooltip="always" v-model="value"></vueSlider>
    </div>
</template>


<script>

    import vueSlider from './../../../../../node_modules/vue-slider-component/src/vue2-slider.vue';

    export default {
        name: 'slider',

        components: {
            "vueSlider":vueSlider,
        },

        data() {
            return {
                value: 0,
            }
        },

        methods: {

        },

        mounted() {
            if (typeof window === "undefined") return;
        }
    }

</script>

<style>

    .poolSlider .miningSlider{
        width: 100%!important;
        margin-top: 60px;
    }

    .miningSlider {
        padding-top: 15px !important;
        padding-bottom: 15px !important;
        padding-left: 20px !important;
        background-color: #262626;
    }

    .vue-slider-component .vue-slider-piecewise {
        background-color: #424242 !important;
    }

    .vue-slider-component .vue-slider-process {
        background: #fec02c !important;
    }

    .vue-slider-component .vue-slider-tooltip{
        min-width: 40px!important;
        color: #262626!important;
        border: 1px solid #fec02c!important;
        background-color: #fec02c!important;
    }

</style>