<template>

    <div class="balanceExp">

        <h1>Last {{this.data.length}} Mined Blocks</h1>

        <loading-spinner class="bountySpinner" v-if="this.data===false" />

        <div v-if="this.data!==false" class="list balancesExplorer blocksExplorer">

            <chart :data="this.chartData" :options="this.chartOptions" class="balanceChart" ></chart>

            <div class="listHead listElement list">
                <div>No.</div>
                <div>C</div>
                <div>Rewarded Address</div>
                <div>Reward</div>
            </div>

            <div class="listElement list" v-for="(element, index) in this.data" :key="'balances '+index">
                <div>{{element.height}}</div>
                <div :style="{backgroundColor: Utils.generateRandomcolor(element.address)}"></div>
                <div class="address">{{element.address}}</div>
                <div class="title">{{Utils.formatMoneyNumber(element.reward)}}</div>
            </div>

        </div>

    </div>

</template>

<script>

    import LoadingSpinner from "client/components/UI/elements/Loading-Spinner.vue";
    import Chart from "client/components/UI/elements/Chart.vue"
    import Utils from 'src/utils/util-functions'

    export default{

        components:{ LoadingSpinner, Chart },

        data: () => {
            return {
                data: false,
                chartData: {},
                chartOptions: {}
            }
        },

        methods:{

            updateChart(blocks, start,stop){

                var newData = [];

                for (let i=stop-1; i>=start; i--){

                    let newElement = blocks[i];

                    newData.push({
                        height: newElement.height,
                        address: WebDollar.Applications.BufferExtended.toBase(WebDollar.Applications.AddressHelper.generateAddressWIF( newElement.data.minerAddress)),
                        reward: newElement.reward + newElement.data.transactions.calculateFees() ,
                    });

                }

                return newData;

            },

            addNewBlock(block){

                var founded = false;

                for (var i =0 ;i<this.data.length;i++){

                    if (this.data[i].height === block.height)
                        founded=true;

                }

                if (!founded){

                    this.data.push({
                        height: block.height,
                        address: WebDollar.Applications.BufferExtended.toBase(WebDollar.Applications.AddressHelper.generateAddressWIF( block.data.minerAddress)),
                        reward: block.reward + block.data.transactions.calculateFees() ,
                    });

                    this.data.sort(function(a,b) {return (a.height < b.height) ? 1 : ((b.height < a.height) ? -1 : 0);} );

                    this.createChardData(this.data);

                }

            },

            mergeDuplicates(blocks){

                let newData=[];

                for (let i=0; i<blocks.length; i++){

                    let found = null;
                    let foundPosition = null;

                    for (let j= 0;j<newData.length;j++){
                        if(blocks[i].address === newData[j].address){
                            found = newData[j];
                            foundPosition=j;
                            break;
                        }
                    }

                    if (found === null)
                        newData.push({
                            height: blocks[i].height,
                            address: blocks[i].address,
                            reward: blocks[i].reward,
                        });

                    else {
                        newData[foundPosition].reward += blocks[i].reward;
                    }

                }

                return newData;

            },

            createChardData(){

                let chartData = this.mergeDuplicates(this.data);

                chartData.sort(function(a,b) {return (a.reward > b.reward) ? 1 : ((b.reward > a.reward) ? -1 : 0);} );

                this.chartData= {
                    labels: [],
                    datasets: [
                        {
                            label: 'Balance Distribution',
                            data: [],
                            backgroundColor: [],
                            borderColor: [],
                            borderWidth:2
                        }
                    ],
                };

                this.chartOptions = {

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

                for(var i=0;i<chartData.length; i++){

                    var color = Utils.generateRandomcolor(chartData[i].address);

                    this.chartData.datasets[0].data.push(chartData[i].reward);
                    this.chartData.labels.push(chartData[i].address);
                    this.chartData.datasets[0].backgroundColor.push(color);
                    this.chartData.datasets[0].borderColor.push('#fff');

                }

            }

        },

        computed:{

            Utils(){
                return Utils;
            }

        },

        mounted(){

            if (typeof window === "undefined") return false;

            if (WebDollar.Blockchain.synchronized){

                var start = WebDollar.Blockchain.blockchain.blocks.blocksStartingPoint;
                var stop = WebDollar.Blockchain.blockchain.blocks.length;

                let blocks = WebDollar.Blockchain.blockchain.blocks;
                this.data = this.updateChart(blocks, start,stop);
                this.createChardData(this.data);

            }

            WebDollar.StatusEvents.emitter.on("blockchain/status", (data)=>{

                if (data.message === "Blockchain Ready to Mine"){

                    var start = WebDollar.Blockchain.blockchain.blocks.blocksStartingPoint;
                    var stop = WebDollar.Blockchain.blockchain.blocks.length;

                    let blocks = WebDollar.Blockchain.blockchain.blocks;
                    this.data = this.updateChart(blocks, start,stop);
                    this.createChardData(this.data);

                    WebDollar.StatusEvents.on("blockchain/blocks-count-changed", (blocksLength)=>{

                        this.addNewBlock(WebDollar.Blockchain.blockchain.blocks[blocksLength-1]);

                    });

                }

            });

        }

    }

</script>

<style>

    .balanceChart{
        padding: 40px 0 40px 0;
    }

</style>