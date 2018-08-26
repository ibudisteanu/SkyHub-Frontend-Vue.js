<template>

    <div>

        <h2>Miner Details</h2>

        <div class="selectedMinerInfo">

            <span class="minerData address addressTextBox">{{this.address}}</span>

            <div class="statisticsContent">

                <div class="dataStatisticsItem">
                    <span class="titlePool">Status:</span>
                    <span class="minerData">{{element.active===true ? 'Mining' : 'Offline'}}</span>
                </div>

                <div class="dataStatisticsItem">
                    <span class="titlePool">Total Hash/s:</span>
                    <span class="minerData">{{this.miner.hashs}} M/s</span>
                </div>

                <div class="dataStatisticsItem">
                    <span class="titlePool">Invitated:</span>
                    <span class="minerData">{{element.referrals.length}}</span>
                </div>

                <div class="dataStatisticsItem">
                    <span class="titlePool">Next Reward:</span>
                    <span class="minerData">{{this.getNextReward(element)}}</span>
                </div>

                <div class="dataStatisticsItem">
                    <span class="titlePool">Total Win:</span>
                    <span class="minerData">{{element.avaiableReward}}</span>
                </div>

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Next Reward:</span>
                    <span class="time">{{this.getNextReward(element)}}</span>
                </div>

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Total Win:</span>
                    <span class="size yellowText">{{element.avaiableReward}}</span>
                </div>

                <div class="dataStatisticsItem">
                    <span class="titlePool">Instances:</span>
                    <span class="minerData">{{element.instances.length}}</span>
                </div>

                <div>

                    <div v-for="(element, index) in element.instances" :key="'minerInstances '+index">

                        <div class="mobileTableShow">
                            <span class="mobileTableShowTitle">Next Reward:</span>
                            <span class="time">{{this.getNextReward(element)}}</span>
                        </div>

                        <div class="mobileTableShow">
                            <span class="mobileTableShowTitle">Total Win:</span>
                            <span class="size yellowText">{{element.avaiableReward}}</span>
                        </div>

                        <div class="dataStatisticsItem">
                            <span class="titlePool">Hash/s:</span>
                            <span class="minerData">{{this.miner.hashs}} M/s</span>
                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>

</template>

<script>

    import Utils from 'src/utils/util-functions'

    export default{

        props: {
            miner: {default: 'list'},
        },

        data:()=>{
            return {

            }
        },

        mounted(){

            if (typeof window === "undefined") return;


        },

        methods: {


        },

    }

</script>

<style>

    .addressTextBox{
        background-color: #505050;
        width: 100%;
        text-align: center;
    }

    .dataStatisticsItem{
        display: grid;
        border-top:solid 1px #545454;
        grid-template-columns: 150px 1fr;
    }

    .dataStatisticsItem:last-child{
        border-bottom:solid 1px #3e3e3e;
    }

    .dataStatisticsItem span{
        width: 100%;
    }

    .dataStatisticsItem .minerData{
        text-align: right;
    }

    .statisticsContent{
        display: block;
        padding: 20px 10px 0 10px;
        overflow-y: scroll;
    }

</style>