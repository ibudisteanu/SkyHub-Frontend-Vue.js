<template>

    <div id="dashboardMining" class="walletSection" >

        <div id="minningController">
            <p class="miningPowerText">Mining <br/> <span class="secondWord">Power</span></p>
            <strong id="threadsNumber" :style="{background: this.miningWorkersCount ? 0 : '#d23c25'}">{{this.miningWorkersCount}}</strong>
            <div id="miningDetails">
                <p class="">{{this.statusMining||(this.hashesPerSecond.toString()+' hashes/sec')}} </p>
            </div>
        </div>

        <div type="button" class="walletStartMining">
            <div id="threadsControll">
                <div class="button leftButton" type="button" @click="this.destroyOneMiningWorker"> <p>-</p>
                </div>
                <p class="miningPowerThreads">Threads</p>
                <div class="button rightButton" type="button"  @click="this.createMiningWorker"> <p>+</p>
                </div>
            </div>
        </div>

        <p class="WEBD">{{ Math.round(this.reward * 10000000) / 10000000 }} <b class="whiteText">WBD MINED</b></p>

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

                statusMining:'',
            }
        },

        computed:{

            startedMining(){
                return this.$store.state.mining.startedMining;
            },

        },

        props:{
            rewardPerHash: {default: 0.0000052},
        },

        methods:{

            createMiningWorker(){

                if(typeof(Worker) !== "undefined") {


                    let worker = new Worker("/public/WebDollar-dist/WebDollarMinerWorker.js");

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

                this.$store.dispatch('MINING_CHANGE_WORKERS', {workers: this.miningWorkersCount});

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

                this.$store.dispatch('MINING_CHANGE_WORKERS', {workers: this.miningWorkersCount});
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
                console.log('this.startedMining',this.startedMining);
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

<style>


</style>