<template>

    <div id="p2p-network">

        <div id="createPoolSection">

                <div class="">

                    <h1 class="alignCenter bigMarginBottom">CREATE YOUR OWN MINING POOL</h1>

                    <h3 class="alignLeft bigMarginBottom">Status: {{ this.poolStatus }}</h3>

                    <div class="distributionContainer">

                        <div class="distributionGrid">

                            <div class="verticalAlignMiddle">

                                <p class="subtitle">SET YOUR POOL FEE</p>
                                <slider ref="refPoolFee" @changed="this.handleChangePoolFee"/>

                                <p class="createPoolLink">Mine WEBD with your friends! Create your own Mining Pool now, by using the Button below. See your Mining Pool stats in real-time.</p>

                                <router-link to="/mypool">
                                    <p class="copyPoolLink">My mining pool</p>
                                </router-link>

                            </div>

                        </div>
                        <div class="distributionGrid poolDescription">

                            <div class="verticalAlignMiddle">

                                <p class="poolDescription">Invite friends to start mining in your pool, instantly</p>
                                <p class="copyPoolLink" v-show="this.poolURL !== ''" @click="copyToClipboard">
                                    Copy invite link
                                </p>

                                {{this.poolURL}}

                                <div class="dataStatisticsItem" v-for="(poolServer, index) in this.poolServers">
                                    <span class="titlePool serverPool" >{{poolServer.name}}</span>
                                    <span class="minerData serverPoolStatus" >{{poolServer.connected ? 'established' : 'not established'}} </span>
                                </div>


                            </div>


                        </div>

                    </div>

                </div>

            </div>

    </div>

</template>

<script>

    import Vue from 'vue/dist/vue';

    import slider from '../../../UI/elements/Slider.vue';
    import Clipboard from 'v-clipboard';

    export default{

        name: 'pool',

        data: () => {
            return {
                poolStatus: '',
                poolURL: '',
                poolFee: 0,
                poolServers: {},
            }
        },

        components: {
            "slider":slider
        },

        methods: {

            async handleChangePoolFee(fee){

                this.poolFee = fee;

                if (WebDollar.Blockchain.PoolManagement !== undefined)
                    await WebDollar.Blockchain.PoolManagement.poolSettings.setPoolFee(this.poolFee/100);
            },

            copyToClipboard(){
                this.$clipboard('test-link');
            },


            loadPoolData(){

                if (WebDollar.Blockchain.PoolManagement === undefined){

                    this.poolStatus = "not initialized";

                } else {

                    if (WebDollar.Blockchain.PoolManagement.poolInitialized) this.poolStatus = "initialized";
                    if (WebDollar.Blockchain.PoolManagement.poolOpened) this.poolStatus = "configured";
                    if (WebDollar.Blockchain.PoolManagement.poolStarted) this.poolStatus = "started";

                    let poolServers = WebDollar.Blockchain.PoolManagement.poolSettings.poolServers;
                    this.poolServers = WebDollar.Applications.PoolsUtilsHelper.getPoolServersStatus(poolServers);

                    this.poolURL = WebDollar.Blockchain.PoolManagement.poolSettings.poolURL;

                    this.poolFee = Math.floor( WebDollar.Blockchain.PoolManagement.poolSettings.poolFee*100 , 2 );
                    if (this.$refs['refPoolFee'] !== undefined)
                        this.$refs['refPoolFee'].value = this.poolFee;


                }


            }

        },

        mounted() {

            if (typeof window === 'undefined') return;

            Vue.use(Clipboard);


            WebDollar.StatusEvents.on("pools/status", (data) => {

                this.loadPoolData();

            });

            WebDollar.StatusEvents.on("pools/settings",(data)=>{

                this.loadPoolData();

            });

            this.loadPoolData();

        }

    }

</script>

<style>

    .serverPool{
        display: inline;
        padding-right: 20px ;
    }

    .serverPoolStatus{
        display: inline;
    }

</style>