<template>

    <div id="p2p-network">

        <div id="createPoolSection">

                <div class="">

                    <h1 class="alignCenter bigMarginBottom">POOL Mining</h1>

                    <div class="distributionContainer">

                        <div class="distributionGrid">
                            <h2 class="subtitle">SET YOUR POOL FEE</h2>
                        </div>
                        <div class="distributionGrid">
                            <h2 class="subtitle">Pool Statistics</h2>
                        </div>

                        <div class="distributionGrid">

                            <div class="verticalAlignMiddle">

                                <slider ref="refPoolFee" @changed="this.handleChangePoolFee"/>

                                <p class="createPoolLink">Mine WEBD with your friends! Create your own Mining Pool now, by using the Button below. See your Mining Pool stats in real-time.</p>

                                <router-link to="/mypool">
                                    <p class="copyPoolLink">My mining pool</p>
                                </router-link>

                            </div>

                        </div>
                        <div class="distributionGrid poolDescription">

                            <div class="verticalAlignMiddle">

                                <!--<p class="poolDescription">Invite friends to start mining in your pool, instantly</p>-->
                                <!--<p class="copyPoolLink disabledColors" v-show="this.poolURL !== ''" @click="copyToClipboard">-->
                                    <!--Copy invite link-->
                                <!--</p>-->


                                <span class="oneLineText">
                                    Status: <span class="normalSpan" :class="this.selectStatusColor()">{{ this.poolStatus }}</span>
                                </span>
                                <span class="oneLineText">
                                    Online Hosts: <span class="normalSpan" :class="this.selectOnlineHostColor()"> {{ this.onlineHosts() }} </span>
                                </span>
                                <span class="oneLineText">
                                    Miners: <span class="normalSpan" :class="this.isNotNullColor()"> {{this.poolMinerNumber}} </span>
                                </span>
                                <span class="oneLineText">
                                    Pool Hash: <span class="normalSpan"> 500 MH/s </span>
                                </span>

                            </div>


                        </div>

                    </div>

                </div>

            </div>

    </div>

</template>

<script>

    import Vue from 'vue/dist/vue';

    Vue.use(Clipboard);

    import slider from '../../../UI/elements/Slider.vue';
    import Clipboard from 'v-clipboard';

    export default{

        name: 'pool',

        data: () => {
            return {
                poolStatus: '',
                poolURL: '',
                poolFee: 0,
                poolMinerNumber: 0,
                poolGlobalHash: 0,
                poolServers: {},
            }
        },

        components: {
            "slider":slider
        },

        methods: {

            numberOfConnectedHosts(){

                var enabledHosts=0;

                for(var i=0;i<=this.poolServers;i++){

                    if(this.poolServers.connected === true) enabledHosts++

                }

                return enabledHosts;

            },

            async handleChangePoolFee(fee){

                this.poolFee = fee;

                if (WebDollar.Blockchain.PoolManagement !== undefined)
                    await WebDollar.Blockchain.PoolManagement.poolSettings.setPoolFee(this.poolFee/100);
            },

            copyToClipboard(){
                this.$clipboard(this.poolURL);
            },

            isNotNullColor(){

                if (this.poolMinerNumber===0) return 'redColor';

                return 'greenColor';

            },

            selectStatusColor(){

                if (this.poolStatus==='Started') return 'greenColor';
                if (this.poolStatus==='Configured') return 'redColor';

                return 'yellowColor';

            },

            selectOnlineHostColor(){

                if(this.numberOfConnectedHosts()===0)  return 'redColor';

                if (Object.keys(this.poolServers).length=== this.numberOfConnectedHosts()) return 'greenColor';

                return 'yellowColor'

            },

            onlineHosts(){

                return this.numberOfConnectedHosts() + ' / ' + Object.keys(this.poolServers).length;

            },

            loadPoolData(){

                if (WebDollar.Blockchain.PoolManagement === undefined){

                    this.poolStatus = "not initialized";

                } else {

                    if (WebDollar.Blockchain.PoolManagement.poolInitialized) this.poolStatus = "Initialized";
                    if (WebDollar.Blockchain.PoolManagement.poolOpened) this.poolStatus = "Configured";
                    if (WebDollar.Blockchain.PoolManagement.poolStarted) this.poolStatus = "Started";

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