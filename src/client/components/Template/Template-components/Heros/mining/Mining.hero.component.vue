/**
* Created by BIT TECHNOLOGIES on 5/28/2017.
*/

<template>


        <SimpleHero url="/" coverColor="EDEDED" height="300px">

            <div slot="hero-content" style="text-align: center">

                <h1 class='fg-white' style="display: inline; font-size: 60px; font-weight: bold; text-transform: none; color: #12428c; text-align: center; margin-bottom: 10px; padding-left: 0.5em; padding-right: 0.5em; ">
                    MINE NOW in Browser
                </h1>

                <div style="padding-bottom: 80px"> </div>

                <div class="col-md-4 col-md-offset-2">
                    <button class="btn btn-success  dim btn-large-dim" type="button" style="width: auto" @click="this.startStopMining">
                        <i class="fa fa-wrench"></i> {{this.startedMining === true ? 'STOP' : 'START'}}
                    </button>
                </div>

                <div class="col-md-6" style="padding-bottom: 30px">
                    <div class="row" style="padding-bottom: 10px">
                        <h1 class="fg-white" style="display: inline; font-size: 60px; text-transform: none; color: #12428c; text-align: center; margin-bottom: 10px; padding-left: 0.5em; padding-right: 0.5em; ">{{this.statusMining||(this.hashesPerSecond.toString()+'h/s')}} </h1>
                    </div>
                    <div class="row" style="padding-top: 10px">
                        <h2 class="fg-white" style="display: inline; font-size: 14px; text-transform: none; color: #12428c; text-align: center; margin-bottom: 10px; padding-left: 0.5em; padding-right: 0.5em; ">best: {{this.hashesGeneratedBest}} </h2>
                    </div>
                    <div class="row" style="padding-top: 10px">
                        <h2 class="fg-white" style="display: inline; font-size: 20px; text-transform: none; color: #12428c; text-align: center; margin-bottom: 10px; padding-left: 0.5em; padding-right: 0.5em; "><strong>{{ Math.round(this.reward * 10000000) / 10000000 }} WEBD</strong></h2>
                    </div>

                    <div class="row" style="padding-top: 12px">
                        <button class="btn btn-danger btn-circle " type="button" style="margin-right: 50px" @click="this.destroyOneMiningWorker"><i class="fa fa-minus"></i>
                        </button>

                        <strong>Threads: {{this.miningWorkersCount}}</strong>

                        <button class="btn btn-info btn-circle " type="button" style="margin-left: 50px" @click="this.createMiningWorker"><i class="fa fa-plus"></i>
                        </button>

                    </div>
                </div>

            </div>

        </SimpleHero>


</template>


<script>

    import SimpleHero from '../styles/Simple.hero.component.vue';

    export default{

        name: 'MiningHeaderCover',

        components: {
            'SimpleHero': SimpleHero,
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