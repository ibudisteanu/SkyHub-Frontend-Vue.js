<template>

    <div>

        <h2>Pool Address</h2>

        <div class="selectedMinerInfo">

            <span class="minerData address addressTextBox">{{this.pool.address}}</span>

            <div class="statisticsContent">

                <div class="dataStatisticsItem" title="All your miners estimated hash rate">
                    <span class="titlePool">Pool Hash/s:</span>
                    <span class="minerData">{{this.pool.hashs}}</span>
                </div>

                <div class="dataStatisticsItem">
                    <span class="titlePool" title="Your reward at next block mined by pool">NB Reward:</span>
                    <span class="minerData">{{this.pool.hashrate}} WEBD</span>
                </div>

                <div class="dataStatisticsItem">
                    <span class="titlePool" title="All yours miners reward at next block mined by your pool">NB Miner Reward:</span>
                    <span class="minerData">{{this.pool.NextBlockMinerReward}} WEBD</span>
                </div>

                <div class="dataStatisticsItem">
                    <span class="titlePool" title="All your servers reward at next block mined by your pool">NB Servers Reward:</span>
                    <span class="minerData">{{this.pool.NextBlockServerReward}} WEBD</span>
                </div>

                <div class="dataStatisticsItem" title="Aproximed time to wait until your pool will mine the next block">
                    <span class="titlePool">NB Mining Time:</span>
                    <span class="minerData">{{this.pool.hashs}} WEBD</span>
                </div>

            </div>

        </div>

    </div>

</template>

<script>

    export default{

        props: {
            pool: {default: 'list'},
        },

        mounted(){

            if (typeof window === "undefined") return;

        }

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