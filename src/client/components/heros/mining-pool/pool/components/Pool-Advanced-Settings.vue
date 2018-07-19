<template>

    <div>

        <h2 class="alignCenter yellowColor marginTop">SETTINGS</h2>

        <div class="alignCenter bigMarginTop" v-if="!this.initialized">
            <loading-spinner class="fillColor"></loading-spinner>
        </div>

        <div v-show="this.initialized">

            <div class="smallSettings largePadding" >

                <div>

                    <div class="slidersSection">

                        <div class="poolSettingsRow specialRaw">

                            <div class="poolSettingsRow feeSlider">
                                <div class="settingsTitle">
                                    Owner Fee:
                                </div>
                                <slider ref="refPoolFee" :interval="0.1" :min="1" :max="100" @changed="this.handleChangePoolFee"/>
                            </div>

                            <div class="poolSettingsRow feeSlider">
                                <div class="settingsTitle specialTitle">
                                    Hosts Fee:
                                </div>
                                <slider ref="refHostsFee" :interval="0.1" :min="1" :max="100" @changed="this.handleChangePoolFee"/>
                            </div>

                        </div>

                        <div class="poolSettingsRow specialRaw">

                            <div class="poolSettingsRow feeSlider">
                                <div class="settingsTitle">
                                    Referral Fee:
                                </div>
                                <slider ref="refReferralFee" :interval="1" :min="1" :max="100" :disabled="true" @changed="this.handleChangePoolFee"/>
                            </div>

                            <div class="poolSettingsRow feeSlider">
                                <div class="settingsTitle specialTitle">
                                    Pay frequency:
                                </div>
                                <slider ref="refFrequency" :interval="10" :min="10" :max="10000" @changed="this.handleChangePoolFee"/>
                            </div>

                        </div>

                        <div class="poolSettingsRow specialRaw">

                            <div class="poolSettingsRow specialSegment">
                                <div class="settingsTitle">
                                    Pool Name:
                                </div>
                                <div>
                                    <input type="text" class="input" v-model="poolName" placeholder="WebDollar Pool">
                                </div>
                            </div>

                            <div class="poolSettingsRow specialSegment">
                                <div class="settingsTitle specialTitle">
                                    Pool Website:
                                </div>
                                <div>
                                    <input type="text" class="input" v-model="poolWebsite" placeholder="http://url" >
                                </div>
                            </div>

                        </div>

                    </div>

                    <div class="poolSettingsRow slidersSection paddingBottom40">
                        <div class="settingsTitle">
                            Pool Host:
                        </div>
                        <div class="twoColums serverHostItemsBox">
                            <!--<div class="addNewHostBox" v-for="(poolServer, index) in this.poolServers">-->
                                <!--<div class="serverInfo">-->
                                    <!--<span class="titlePool serverPool" >{{poolServer.name}}</span>-->
                                    <!--<span class="minerData serverPoolStatus" >{{poolServer.connected ? 'connected - '  + (poolServer.established ? 'established' : 'not established' )  : 'not connected'}} </span>-->
                                <!--</div>-->
                                <!--<div class="deleteButton" @click="this.removePoolHost(index)">-->
                                    <!--Remove-->
                                <!--</div>-->
                           <!--</div>-->
                            <div class="addNewHostBox" >
                                <div class="serverInfo">
                                    <span class="titlePool serverPool" >127.22.11.33:8888</span>
                                    <span class="minerData serverPoolStatus" > (test) </span>
                                </div>
                                <span class="deleteButton">
                                    Remove
                                </span>
                            </div>
                            <div class="addNewHostBox" >
                                <div class="serverInfo">
                                    <span class="titlePool serverPool" >127.22.33.3.2</span>
                                    <span class="minerData serverPoolStatus" > (tess)  </span>
                                </div>
                                <span class="deleteButton">
                                    Remove
                                </span>
                            </div>
                            <div class="addNewHostBox" >
                                <div class="serverInfo">
                                    <span class="titlePool serverPool" >127.22.33.3.2</span>
                                    <span class="minerData serverPoolStatus" > (test)  </span>
                                </div>
                                <span class="deleteButton">
                                    Remove
                                </span>
                            </div>
                            <div class="addNewHostBox">
                                <input v-model="newServer" placeholder="Add New Host" class="addNewHostInput">
                                <button @click="addNewHost" class="minerData buttonSmall settingsButton addNewHostButton">Add</button>
                            </div>
                        </div>
                    </div>

                    <div class="poolSettingsRow" v-if="this.poolURL!=''">
                        <div class="settingsTitle feeHeight">
                            Invitation URL:
                        </div>
                        <input ref="poolUrl" type="text" class="input" :value="this.poolURL" placeholder="http://url" @click="selectURL($event.target)">
                    </div>

                    <div class="poolSettingsRow" v-if="this.poolURL!=''">
                        <div class="settingsTitle">
                            Referral Type:
                        </div>
                        <div>
                            <select type="checkbox" value="poolActivated" v-model="referralSetting">
                                <option>Dezactived</option>
                                <option>Fee from invited</option>
                                <option>Fee from block</option>
                            </select>
                        </div>
                    </div>

                    <div class="poolSettingsRow" v-if="this.poolURL!=''">
                        <div class="settingsTitle">
                            Pool Activated:
                        </div>
                        <div>
                            <input type="checkbox" value="poolActivated" v-model="poolSettings">
                        </div>
                    </div>

                </div>

            </div>

            <div class="buttonsContainer">

                <div class="buttonContainer">
                    <button @click="handleSaveSettings" class="minerData buttonSmall settingsButton saveButton">Save Settings</button>
                    {{this.error}}
                </div>

            </div>

        </div>

    </div>

</template>

<script>

    import slider from 'client/components/UI/elements/Slider.vue';
    import LoadingSpinner from "client/components/UI/elements/Loading-Spinner.vue"

    export default{

        components: {
            slider,LoadingSpinner
        },

        data: ()=>{

            return {

                loaded:false,
                initialized: false,

                poolFee: 0,
                poolName: '',
                poolWebsite: '',

                poolServers: '',
                poolURL: '',

                poolSettings: [],

                error: '',
                newServer: '',
                referralSetting:''
            }

        },

        methods: {

            removePoolHost(index){

//                this.poolServers

            },

            addNewHost(){

                if (this.poolServers==='') this.poolServers = this.newServer;
                    else this.poolServers = this.poolServers + ',' + this.newServer;

                this.newServer ='';

            },

            selectURL(target){
                target.select();
            },

            handleChangePoolFee(value){
                this.poolFee = value;
            },

            async handleSaveSettings(){

                if (!WebDollar.Blockchain.loaded){
                    console.warn("Blockchain was not loaded!");
                    return;
                }

                let poolActivated = this.poolSettings.indexOf("poolActivated") >= 0;

                this.poolURL = '';

                try{

                    await WebDollar.Blockchain.PoolManagement.poolSettings.setPoolName(this.poolName);
                    await WebDollar.Blockchain.PoolManagement.poolSettings.setPoolFee(this.poolFee/100);
                    await WebDollar.Blockchain.PoolManagement.poolSettings.setPoolWebsite(this.poolWebsite);
                    await WebDollar.Blockchain.PoolManagement.poolSettings.setPoolServers(this.poolServers);
                    await WebDollar.Blockchain.PoolManagement.poolSettings.setPoolActivated(poolActivated);

                    this.error = '';

                } catch (exception){
                    this.error = exception.message;
                    return;
                }

                this.poolURL = WebDollar.Blockchain.PoolManagement.poolSettings.poolURL;

            },

            async loadData(){

                if (WebDollar.Blockchain.PoolManagement === undefined) return;

                this.poolName = WebDollar.Blockchain.PoolManagement.poolSettings.poolName;
                this.poolFee = Math.floor( WebDollar.Blockchain.PoolManagement.poolSettings.poolFee*100, 2);
                this.poolServers = WebDollar.Blockchain.PoolManagement.poolSettings.poolServers;
                this.poolWebsite = WebDollar.Blockchain.PoolManagement.poolSettings.poolWebsite;

                let poolSettings = [];
                if (WebDollar.Blockchain.PoolManagement.poolSettings.poolActivated)
                    poolSettings.push("poolActivated");

                this.poolSettings = poolSettings;

                this.poolURL = WebDollar.Blockchain.PoolManagement.poolSettings.poolURL;

                if (this.$refs['refPoolFee'] !== undefined)
                    this.$refs['refPoolFee'].value = this.poolFee;

            },

            async asyncData ({ store,  route: { params: { a,b, c, d, e, f }} }) {

                return true;

            },

        },

        mounted() {

            if (typeof window === "undefined") return;

            if (WebDollar.Blockchain.PoolManagement === undefined) this.initialized = false;
            else this.initialized = WebDollar.Blockchain.PoolManagement.poolInitialized || false;

            WebDollar.Blockchain.onLoaded.then((answer) => {

                this.loaded = true;
                this.loadData();

            });

            WebDollar.StatusEvents.on("pools/status", (data) => {

                switch (data.message) {

                    case "Pool Initialization changed":
                        console.log("Pool Initialization changed");
                        this.initialized = data.result;
                        this.loadData();
                        break;

                }

            });

            WebDollar.StatusEvents.on("pools/settings",(data)=>{

            });

        }

    }

</script>

<style>

    .paddingBottom40{
        padding-bottom: 40px!important;
    }

    .serverHostItemsBox{
        grid-row-gap: 10px;
        grid-column-gap: 20px;
    }

    .serverPool{
        line-height: 39px;
        margin-left: 10px;
        color: #fff;
    }

    .smallSettings input::placeholder{
        color: #686868 !important;
    }

    .addNewHostButton:hover{
        background-color: #ffdb85;
    }

    .slidersSection{
        border-bottom: solid 1px #a9a9a9;
        margin-bottom: 30px;
        padding-bottom: 30px;
    }

    .deleteButton{
        background-color: #8a1c0b;
        border: none;
        padding: 0;
        margin: 0 auto;
        width: 100%;
        font-size: 14px;
        line-height: 39px;
        border-radius: 5px;
        cursor: pointer;
        color: #fff;
        text-align: center;
        left: 0;
        display: block;
        right: 0;
        border-top-left-radius: 0;
        font-weight: bolder!important;
        border-bottom-left-radius: 0;
    }

    .deleteButton:hover{
        background-color: #8a413b;
    }

    .serverPoolStatus{
        line-height: 39px;
        padding-left: 5px;
        font-size: 14px;
    }

    .serversItem{
        display: grid;
        grid-template-columns: 250px 1fr;
        width: 370px;
    }

    .serverInfo{
        border-radius: 3px;
        /* padding: 10px 0 10px 5px; */
        width: 100%;
        background-color: #262626;
        border: solid 1px #3e3e3e;
        color: #fff;
        box-sizing: border-box!important;
        display: block;
        grid-template-columns: auto auto;
        border-top-right-radius:0;
        border-bottom-right-radius:0;
    }

    .serverInfo span{
        display: inline-block;
        width: auto
    ;
    }

    .addNewHostBox{
        display: grid;
        grid-template-columns: 1fr 100px;
    }

    textarea{
        resize:vertical;
    }

    .poolSettingsRow{
        display: grid;
        grid-template-columns: 150px 1fr;
        box-sizing: border-box!important;
        padding: 5px 0;
    }

    .feeSlider{
        margin-top: 20px;
    }

    .settingsButton{
        background-color: #fec02c;
        color:#000;
        font-weight: bolder;
        border:none;
        padding: 0;
        margin: 0 auto;
        font-size: 14px;
        left:0;
        display: block;
        right: 0;
    }

    .fillColor{
        fill: #fec02c!important;
    }

    .buttonContainer{
        display: block;
        margin: 20px 0;
    }

    .smallSettings{
        display: grid;
        grid-template-columns: 1fr;
        padding: 5px;
        grid-row-gap: 5px;
    }

    .addNewHostButton{
        width: 100%;
        border-top-left-radius: 0;
        font-weight: bolder;
        border-bottom-left-radius: 0;
    }

    .addNewHostInput{
        border-top-right-radius:0;
        border-bottom-right-radius:0;
    }

    .settingsTitle{
        font-size: 16px;
        line-height: 26px;
        text-transform: capitalize;
        padding-top: 5px;
        box-sizing: border-box!important;
    }

    .poolSettingsRow input, .poolSettingsRow textarea{
        border-radius: 3px;
        padding: 10px 0 10px 10px;
        width: 100%;
        background-color: #262626;
        border: solid 1px #3e3e3e;
        color:#fff;
        box-sizing: border-box!important;
    }

    .poolSettingsRow input::-webkit-input-placeholder, .poolSettingsRow textarea::-webkit-input-placeholder {
        color:#bdbdbd
    }

    .largePadding{
        padding: 10px 40px;
    }

    .feeHeight{
        line-height: 36px;
    }

    .poolSettingsRow .vue-slider-process{
        background: #fec02c !important;
    }

    .buttonsContainer{
        margin: 0 auto;
        width: 500px;
        display: grid;
        grid-template-columns: 1fr;
    }

    .buttonsContainer .settingsButton{
        padding: 10px 30px;
        font-size: 14px;
        letter-spacing: 1px;
    }

    .poolSlider{
        box-sizing: border-box!important;
    }

    .poolSlider .miningSlider{
        border: solid 1px #3e3e3e;
        border-radius:5px
    }

    .vue-slider-component .vue-slider-tooltip{
        background-color: #3c3a3a!important;
        margin-bottom: 2px;
        border: solid 1px #3e3e3e!important;
    }

    .specialRaw{
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .saveButton{
        width: 400px;
        padding: 16px!important;
        font-size: 18px!important;
    }

    .specialTitle{
        text-align: center;
    }

</style>
