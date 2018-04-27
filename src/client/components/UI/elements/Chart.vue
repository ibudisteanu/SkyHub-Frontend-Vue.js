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

            let chartData= {
                labels: [],
                datasets: [
                    {
                        label: 'Balance Distribution',
                        data: [],
                        backgroundColor: [],
                        borderColor: [],
                    }
                ],
            };

            let chartOptions = {

                    responsive: true,
                    maintainAspectRatio: false,

                    legend: {
                        display: false,
                    },
                    tooltips: {
                        callbacks: {
                            label: (tooltipItems, data) => {

                                var balance = data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index];
                                var address = data.labels[tooltipItems.index];
                                balance = Utils.formatMoneyNumber(balance);
                                return address + ' - ' + balance+' WEBD';
                            }
                        }
                    }

            };

            for(let i=0; i < this.data.length; i++){

                var color = Utils.generateRandomcolor(this.data[i].address);

                chartData.datasets[0].data.push(this.data[i].balance);
                chartData.labels.push(this.data[i].address);
                chartData.datasets[0].backgroundColor.push(color);
                chartData.datasets[0].borderColor.push(color);

            }

            this.renderChart(chartData,chartOptions);

        },

        methods: {


        }

    }

</script>
