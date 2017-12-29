<template>

    <div>

        <div class="col-md-4 col-md-offset-2">
            <button type="button" class="walletStartMining" @click="this.startStopMining">
                {{this.startedMining === true ? 'STOP MINING' : 'START MINING'}}
            </button>
        </div>

        <div>
            <div id="miningDetails">
                <p class="">{{this.statusMining||(this.hashesPerSecond.toString()+' h/s')}} </p>
                <p >Best: {{this.hashesGeneratedBest}} </p>
                <p >{{ Math.round(this.reward * 10000000) / 10000000 }} WEBD</p>
            </div>

            <div >
                <button type="button" @click="this.destroyOneMiningWorker"> -
                </button>

                <strong>Threads: {{this.miningWorkersCount}}</strong>

                <button  type="button"  @click="this.createMiningWorker"> +
                </button>

            </div>
        </div>

    </div>



</template>


<script>

    export default{

        name: 'Mining',

        components: {
        },


        data: function () {
            return {
                hashesPerSecondFuture: 0,
                hashesPerSecond: 0,

                hashesGeneratedBestFuture: '',
                hashesGeneratedBest: '',

                reward: 0,

                hashesPerSecondClearInterval: null,

                miningWorkers: [],
                miningWorkersCount: 0,

                startedMining: false,
                statusMining:'',


            }
        },

        props:{
            rewardPerHash: {default: 0.0000052},
        },

        methods:{

            createMiningWorker(){

                if(typeof(Worker) !== "undefined") {


                    let worker = new Worker("/public/WebDollar-dist/WebDollarMinerWorker.js");

                    let that = this;
                    worker.onmessage = this.puzzleReceivedFromWorker;

                    this.miningWorkers.push(worker);
                    this.miningWorkersCount += 1;

                } else {
                    alert("Sorry! No Web Worker support.");
                }

                if (this.miningWorkersCount === 1) {
                    this.statusMining = 'starting...';
                    this.initializeHashesPerSecondClearInterval();
                }

                this.startedMining = (this.miningWorkersCount > 0);
            },

            stopAllMiningWorkers(){

                for (let i=this.miningWorkers.length-1; i>=0; i--)
                    this.destroyOneMiningWorker();

            },

            destroyOneMiningWorker(){

                if (this.miningWorkers.length > 0){
                    let minerWorker = this.miningWorkers.pop();
                    minerWorker.terminate();
                    minerWorker = undefined;
                    this.miningWorkersCount -= 1;
                }

                if (this.miningWorkersCount === 0){
                    this.suspendHashesPerSecondClearInterval();
                }
                this.startedMining = (this.miningWorkersCount > 0);
            },

            initializeHashesPerSecondClearInterval(){
                //Setting HashesPerSecond Clear Interval

                let that = this;
                this.hashesPerSecondClearInterval = setInterval( function(){ that.hashesPerSecondClearTick() }, 1000);
            },

            suspendHashesPerSecondClearInterval(){
                clearInterval(this.hashesPerSecondClearInterval);
                this.statusMining = 'stopped';
            },

            hashesPerSecondClearTick(){
                this.hashesPerSecond = this.hashesPerSecondFuture;
                this.hashesGeneratedBest = this.hashesGeneratedBestFuture;


                this.reward += this.hashesPerSecond * this.rewardPerHash;


                this.hashesPerSecondFuture = 0;
                this.hashesGeneratedBestFuture = 'zzzzzz';

                this.statusMining = '';
            },

            startStopMining(){
                if (this.startedMining)  this.stopAllMiningWorkers();
                else this.createMiningWorker();
            },


            puzzleReceivedFromWorker(event) {
                this.hashesPerSecondFuture += event.data.count;

                //console.log(this.hashesGeneratedBest, event.data.hashesGeneratedBest,this.hashesGeneratedBest > event.data.hashesGeneratedBest);

                if (this.hashesGeneratedBestFuture > event.data.hashesGeneratedBest)
                    this.hashesGeneratedBestFuture = event.data.hashesGeneratedBest;

                this.hashesGeneratedBestZeros = event.data.hashesGeneratedBestZeros;

            },

        }

    }
</script>