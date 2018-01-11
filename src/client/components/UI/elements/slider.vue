<template>
    <div>
        <vue-slider id="miningWorkersSlider" class="miningSlider" ref="slider" @callback="this.change" :piecewise="true"
                    :width="this.screenWidth < 750 ? 180 : 330" :tooltip="false" :min="0" :max="this.logicalProcessors"
                    v-model="value" :disabled="this.disabled"></vue-slider>
    </div>
</template>


<script>

    import vueSlider from './../../../../../node_modules/vue-slider-component/src/vue2-slider.vue';

    export default {
        name: 'slider',

        components: {
            "vueSlider": vueSlider
        },

        data() {
            return {
                value: 0,
            }
        },

        methods: {

        },

        mounted() {

        }
    }

</script>

<style>

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
        /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#fec02c+29,bc0505+100 */
        background: #fec02c !important; /* Old browsers */
        background: -moz-linear-gradient(left, #fec02c 29%, #bc0505 100%) !important; /* FF3.6-15 */
        background: -webkit-linear-gradient(left, #fec02c 29%, #bc0505 100%) !important; /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(to right, #fec02c 29%, #bc0505 100%) !important; /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fec02c', endColorstr='#bc0505', GradientType=1) !important; /* IE6-9 */
    }

</style>