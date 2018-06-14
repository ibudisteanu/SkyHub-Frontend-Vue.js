<template>

    <div>

        <h2>Miner Address</h2>

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

<!--                <div class="dataStatisticsItem">
                    <span class="titlePool">Initialized</span>
                    <span class="minerData">{{this.initialized ? 'activated' : 'deactivated'}}</span>
                </div>-->

                <div class="dataStatisticsItem">
                    <span class="titlePool">Open</span>
                    <span class="minerData">{{this.open ? 'activated' : 'deactivated'}} </span>
                </div>

                <div class="dataStatisticsItem">
                    <span class="titlePool">Started</span>
                    <span class="minerData">{{this.started ? 'activated' : 'deactivated'}} </span>
                </div>
                <div class="dataStatisticsItem" v-for="(poolServer, index) in this.poolServers">
                    <span class="titlePool">{{poolServer.name}}</span>
                    <span class="minerData">{{poolServer.connected ? 'established' : 'not established'}} </span>
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
                initialized: false,
                open: false,
                started: false,
                poolServers: {},
            }
        },

        mounted(){

            if (typeof window === "undefined") return;

            if (WebDollar.Blockchain.loaded){

                this.loaded= true;
                this.loadData();

            }

            WebDollar.Blockchain.onLoaded.then((answer)=>{

                this.loaded = true;

                this.loadData();

            });

            WebDollar.StatusEvents.on("pools/status", (data)=>{

                switch (data.message === ""){

                    case "Pool was Initialized":
                        this.initialized = data.result;
                        break;

                    case "Pool was Opened":
                        this.open = data.result;
                        break;

                    case "Pool was Started":
                        this.started = data.result;
                        break;

                }

            });

            WebDollar.StatusEvents.on("pools/settings", (data)=>{


                if (data.message === "Pool Settings were saved"){

                    this.getPoolServers( data.poolServers );

                }

            });

        },

        methods: {

            loadData() {

                this.initialized = WebDollar.Blockchain.PoolManagement.poolInitialized;
                this.open = WebDollar.Blockchain.PoolManagement.poolOpened;
                this.started = WebDollar.Blockchain.PoolManagement.poolStarted;
                this.getPoolServers();

            },

            getPoolServers(poolServers){

                if (poolServers === undefined)
                    poolServers = WebDollar.Blockchain.PoolManagement.poolSettings.poolServers;

                this.poolServers = {};

                for (let i=0; i<poolServers.length; i++) {

                    let connected = false;

                    for (let j=0; j< WebDollar.Applications.NodesList.nodes.length; j++ )
                        if (WebDollar.Applications.NodesList.nodes[j].socket.node.sckAddress.matchAddress( poolServers[i] )){
                            connected = true;
                            break;
                        }

                    this.poolServers[i] = {
                        name: poolServers[i],
                        connected: connected,
                    };

                }

            }

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