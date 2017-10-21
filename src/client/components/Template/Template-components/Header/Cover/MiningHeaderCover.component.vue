/**
* Created by BIT TECHNOLOGIES on 5/28/2017.
*/

<template>


        <HeaverCoverSimple url="/" coverColor="EDEDED" height="300px">

            <div slot="header-content" style="text-align: center">

                <h1 class='fg-white' style="display: inline; font-size: 60px; font-weight: bold; text-transform: none; color: #12428c; text-align: center; margin-bottom: 10px; padding-left: 0.5em; padding-right: 0.5em; ">
                    MINE NOW in Browser
                </h1>

                <div style="padding-bottom: 80px"> </div>

                <div class="col-md-4 col-md-offset-2">
                    <button class="btn btn-success  dim btn-large-dim" type="button" style="width: auto" @click="this.startStopMining">
                        <i class="fa fa-wrench"></i> {{this.startedMining === true ? 'STOP' : 'START'}}
                    </button>
                </div>

                <div class="col-md-5" style="padding-bottom: 30px">
                    <div class="row">
                        <h1 class="fg-white" style="display: inline; font-size: 60px; text-transform: none; color: #12428c; text-align: center; margin-bottom: 10px; padding-left: 0.5em; padding-right: 0.5em; ">{{this.hashesPerSecondPrevious}} h/s</h1>
                    </div>
                    <div class="row">
                        <h2 class="fg-white" style="display: inline; font-size: 20px; text-transform: none; color: #12428c; text-align: center; margin-bottom: 10px; padding-left: 0.5em; padding-right: 0.5em; "><strong>{{this.reward}} WEBD</strong></h2>
                    </div>
                    <div class="row" style="padding-top: 12px">
                        <button class="btn btn-danger btn-circle " type="button" style="margin-right: 50px" @click="this.stopOneMiningWorker"><i class="fa fa-minus"></i>
                        </button>
                        <strong>Threads: {{this.miningWorkersCount}}</strong>
                        <button class="btn btn-info btn-circle " type="button" style="margin-left: 50px" @click="this.createMiningWorker"><i class="fa fa-plus"></i>
                        </button>

                    </div>
                </div>

            </div>

        </HeaverCoverSimple>


</template>


<script>

    import HeaverCoverSimple from './HearCoverSimple.component.vue';

    export default{

        name: 'MiningHeaderCover',

        components: {
            'HeaverCoverSimple': HeaverCoverSimple,
        },


        data: function () {
            return {
                hashesPerSecond: 0,
                hashesPerSecondPrevious: 0,

                reward: 0,

                hashesPerSecondClearInterval: null,

                miningWorkers: [],
                miningWorkersCount: 0,

                startedMining: false
            }
        },

        mounted() {
            this.initializeHashesPerSecondClearInterval();
        },

        methods:{

            createMiningWorker(){

                if(typeof(Worker) !== "undefined") {


                    let worker = new Worker("/public/WebDollar-dist/WebDollarMinerWorker.js");

                    let that = this;
                    worker.onmessage = function(event) {
                        that.hashesPerSecond += event.data; //to get the data returned
                    };

                    this.miningWorkers.push(worker);
                    this.miningWorkersCount += 1;

                } else {
                    alert("Sorry! No Web Worker support.");
                }

                this.startedMining = (this.miningWorkersCount > 0);
            },

            stopOneMiningWorker(){

                if (this.miningWorkers.length > 0){
                    let minerWorker = this.miningWorkers.pop();
                    minerWorker.terminate();
                    minerWorker = undefined;
                    this.miningWorkersCount -= 1;
                }

                this.startedMining = (this.miningWorkersCount > 0);
            },

            initializeHashesPerSecondClearInterval(){
                //Setting HashesPerSecond Clear Interval

                let that = this;
                this.hashesPerSecondClearInterval = setInterval( function(){ that.hashesPerSecondClear() }, 1000);
            },

            suspendHashesPerSecondClearInterval(){
                clearInterval(this.hashesPerSecondClearInterval);
            },

            hashesPerSecondClear(){
                this.hashesPerSecondPrevious = this.hashesPerSecond;
                this.hashesPerSecond = 0;
            },

            startStopMining(){
                if (this.startedMining)
                    this.stopOneMiningWorker();
                else this.createMiningWorker();
            },

        }

    }
</script>