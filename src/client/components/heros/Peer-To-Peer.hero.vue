<template>

    <div id="p2p-network">

        <div id="networkSection">
            <div>

                <h1 class="alignCenter">Peer-to-Peer Network</h1>
                <h3 >See your Mining Group Connections in Real-Time </h3>

                <div class="networkConnection">
                    <div class="connectionType">

                        <span>Connection:</span>
                        <select v-model="poolsListSelected" class="poolSelect" @change="handleConnectionSelect">
                            <option class="poolSelectOption" >Consensus (No Pool)</option>
                            <option v-for="(poolListElement, index) in this.poolsList" class="poolSelectOption"  >
                                {{poolListElement.poolName}}
                            </option>
                        </select>

                    </div>
                </div>

                <div id="WebDollarMap"></div>

            </div>
        </div>

    </div>

</template>

<script>

    import Vue from 'vue/dist/vue';

    import slider from '../UI/elements/Slider.vue';
    import Clipboard from 'v-clipboard';

    export default{

        name: 'pool',

        data: () => {
            return {
                poolsList: {},
                poolsListSelected: '',
            }
        },

        components: {
            "slider":slider
        },

        methods: {

            handleConnectionSelect(){

                let poolName = this.poolsListSelected;
                let value;

                if (poolName === "Consensus (No Pool)")
                    value = false;
                else {

                    for (let key in this.poolsList)
                        if (this.poolsList[key].poolName === poolName){
                            value = this.poolsList[key].poolURL;
                            break;
                        }

                }

                WebDollar.Blockchain.MinerPoolManagement.startMinerPool( value , true) ;

            },

            loadData(){

                if ( WebDollar.Blockchain.MinerPoolManagement === undefined){

                } else {

                    let poolsList = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolsList;

                    this.poolsList = {};
                    for (let key in poolsList) {

                        let index = 0;
                        for (let alreadyKey in this.poolsList)
                            if (this.poolsList[alreadyKey].poolName === poolsList[key].poolName + (index > 0 ? ` (${index})` : '')) {
                                index++;
                                break;
                            }

                        Vue.set(this.poolsList, key, poolsList[key]);

                        this.poolsList[key].poolName = this.poolsList[key].poolName + (index > 0 ? ` (${index})` : '');

                    }

                    let minerPoolFound = false;

                    if (WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.minerPoolActivated) {

                        let minerPoolPublicKey = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolPublicKey.toString("hex");

                        for (let poolPublicKey in poolsList)
                            if (poolPublicKey === minerPoolPublicKey) {
                                this.poolsListSelected = poolsList[poolPublicKey].poolName;
                                minerPoolFound = true;
                                break;
                            }


                    }

                    if (!minerPoolFound)
                        this.poolsListSelected = 'Consensus (No Pool)';

                }

            },

        },

        mounted(){

            if (typeof window === "undefined") return;

            WebDollar.StatusEvents.on("miner-pool/settings",data =>  this.loadData() );

            this.loadData();

        }

    }

</script>

<style>

    .networkConnection{
        width: 400px;
        margin: 0 auto;
        margin-bottom: 40px;
    }

    .connectionType{
        display: grid;
        grid-template-columns: 100px 1fr;
        border-bottom: solid 1px #fec02c;
    }

    .connectionType span{
        width: 100%;
        color: #fec02c;
    }

    .connectionType select option{
        text-align-last:center;
        text-align: center;
    }

</style>