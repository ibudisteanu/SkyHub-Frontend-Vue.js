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

            var coloR = [];



            var chartData= {
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

            var chartOptions = {

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

            }

            for(var i=0; i < this.data.length; i++){

                var address = this.data[i].address;
                var balance = this.data[i].balance;
                var color = this.generateRandomcolor(address);

                chartData.datasets[0].data.push(balance);
                chartData.labels.push(address);
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

                var r = sum0 % 255;
                var g = sum1 % 255;
                var b = sum2 % 255;
                return "rgb(" + r + "," + g + "," + b + ")";
            },

            updateNewData(data){

                this.renderChart(data,this.options);

            }

        }

    }

</script>
