<script>

    import VueCharts from 'vue-chartjs'
    import { Pie } from 'vue-chartjs'

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
                        responsive: true,
                    },
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.yLabel;
                            }
                        }
                    }

            };

            for(let i=0; i < this.data.length; i++){

                var color = this.generateRandomcolor(this.data[i].address);

                chartData.datasets[0].data.push(this.data[i].balance);
                chartData.labels.push(this.data[i].address);
                chartData.datasets[0].backgroundColor.push(color);
                chartData.datasets[0].borderColor.push(color);

            }

            this.renderChart(chartData,chartOptions);

        },

        methods: {

            generateRandomcolor(address){

                let sum0=0, sum1=0,
                    sum2 = 0;
                for (let i=0; i<address.length; i++){

                    if (i %3 === 0)
                        sum0 = sum0 + address.charCodeAt(i);
                    else
                    if (i %3 === 1)
                        sum1 = sum1 + address.charCodeAt(i);
                    else
                    if (i %3 === 2)
                        sum2 = sum2 + address.charCodeAt(i);
                }

                return "rgb(" + sum0 % 256 + "," + sum1 % 256 + "," + sum2 % 256 + ")";
            },

            updateNewData(data){

                this.renderChart(data,this.options);

            }

        }

    }

</script>
