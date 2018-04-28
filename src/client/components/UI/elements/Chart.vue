<script>

    import VueCharts from 'vue-chartjs'
    import { Pie } from 'vue-chartjs'
    import Utils from 'src/utils/util-functions'

    export default {

        extends: Pie,
        name:'PriceChart',

        props: ['data','options'],

        data () {
            return {
            }
        },

        mounted() {

            this.renderChart(this.data,this.options);

        },

        methods: {


        }

    }

</script>
