<template>

    <div>

        <h2>Miners Dashboard</h2>

        <div class="selectedMinerInfo">

            <span class="minerData address addressTextBox">{{this.miner.address}}</span>

            <div class="statisticsContent">

                <div class="dataStatisticsItem">
                    <span class="titlePool">Next Block Reward:</span>
                    <span class="minerData">{{this.miner.nextReward}} WEBD</span>
                </div>

                <div class="dataStatisticsItem">
                    <span class="titlePool">History Reward:</span>
                    <span class="minerData">{{this.miner.allRewards}} WEBD</span>
                </div>

                <div class="dataStatisticsItem">
                    <span class="titlePool">Hash/s:</span>
                    <span class="minerData">{{this.miner.hashs}} WEBD</span>
                </div>

            </div>

        </div>

    </div>

</template>

<script>

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
        border-top:solid 1px #3e3e3e;
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