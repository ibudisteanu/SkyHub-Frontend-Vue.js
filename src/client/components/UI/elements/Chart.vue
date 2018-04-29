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

        computed: {
            chartData() {
                return this.data;
            },
            chartOptions(){
                return this.options;
            }
        },

        watch: {
            data: function() {
                if ( this.$data._chart !== undefined) this.$data._chart.destroy();
                this.renderChart(this.chartData,this.chartOptions);
            }
        },

        mounted() {

            if (typeof window === "undefined") return false;

            this.renderChart(this.chartData,this.chartOptions);

        },

        methods: {
//
//            rerender(){
//
//                this.renderChart(this.data,this.options);
//
//            }

        }

    }

</script>
