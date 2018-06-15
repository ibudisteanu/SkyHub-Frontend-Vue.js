<template>

    <div>

        <h2 class="alignCenter yellowColor">SETTINGS</h2>

        <div class="alignCenter bigMarginTop" v-if="!this.initialized">
            <loading-spinner class="fillColor"></loading-spinner>
        </div>

        <div v-show="this.initialized">

            <div class="smallSettings largePadding" >

                <div>

                    <div class="poolSettingsRow">
                        <div class="settingsTitle feeHeight">
                            FEE Percent:
                        </div>
                        <slider ref="refBar" @changed="this.handleChangePoolFee"/>
                    </div>

                    <div class="poolSettingsRow">
                        <div class="settingsTitle">
                            Pool Name:
                        </div>
                        <div>
                            <input type="text" class="input" v-model="poolName" placeholder="WebDollar Pool">
                        </div>
                    </div>

                    <div class="poolSettingsRow">
                        <div class="settingsTitle">
                            Pool Website:
                        </div>
                        <div>
                            <input type="text" class="input" v-model="poolWebsite" placeholder="http://url" >
                        </div>
                    </div>

                    <div class="poolSettingsRow">
                        <div class="settingsTitle">
                            Pool Servers:
                        </div>
                        <div>
                    <textarea rows="4" cols="50" v-model="poolServers">
                        832.213.23.21:312;
                        32.123.12.312:221
                    </textarea>
                        </div>
                    </div>

                    <div class="poolSettingsRow" v-if="this.poolURL!='-'">
                        <div class="settingsTitle feeHeight">
                            Invitation URL:
                        </div>
                        <input type="text" class="input" v-model="poolURL" placeholder="http://url" @focus="$event.target.select()" disabled>
                    </div>

                    <div class="poolSettingsRow" v-if="this.poolURL!='-'">
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
                    <button @click="handleSaveSettings" class="minerData buttonSmall settingsButton" :disabled="!this.initialized">Save Settings</button>
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
            }

        },

        methods: {

            handleChangePoolFee(value){
                this.poolFee = value/100;
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
                    await WebDollar.Blockchain.PoolManagement.poolSettings.setPoolFee(this.poolFee);
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

            copyClipboardPoolURL(){

                this.$refs['poolUrl'].select();
                document.execCommand('copy');

            },

            async loadData(){

                if (WebDollar.Blockchain.PoolManagement === undefined) return;

                this.poolName = WebDollar.Blockchain.PoolManagement.poolSettings.poolName;
                this.poolFee = WebDollar.Blockchain.PoolManagement.poolSettings.poolFee*100;
                this.poolServers = WebDollar.Blockchain.PoolManagement.poolSettings.getPoolServersText();
                this.poolWebsite = WebDollar.Blockchain.PoolManagement.poolSettings.poolWebsite;
                this.poolSettings  = WebDollar.Blockchain.PoolManagement.poolSettings.poolActivated ? ["poolActivated"] : [];

                this.poolURL = WebDollar.Blockchain.PoolManagement.poolSettings.poolURL;

                if (this.$refs['refBar'] !== undefined)
                    this.$refs['refBar'].value = this.poolFee;

            }

        },

        mounted() {

            if (typeof window === "undefined") return;

            if (WebDollar.Blockchain.PoolManagement === undefined) this.initialized = false;
            else this.initialized = WebDollar.Blockchain.PoolManagement.poolInitialized || false;

            if (WebDollar.Blockchain.loaded) {

                this.loaded = true;
                this.loadData();

            }

            WebDollar.Blockchain.onLoaded.then((answer) => {

                this.loaded = true;

                this.loadData();

            });

            WebDollar.StatusEvents.on("pools/status", (data) => {

                switch (data.message) {

                    case "Pool Initialization changed":
                        this.initialized = data.result;
                        this.loadData();
                        break;

                }

            });

        }

    }

</script>

<style>

    .poolLink{
        /*width: 100%;*/
        word-break: break-all;
        /*margin: 0 auto;*/
        /*color: #fec02c;*/
        /*font-size: 14px;*/
        /*cursor: pointer;*/
    }

    .poolSettingsRow{
        display: grid;
        grid-template-columns: 150px 1fr;
        box-sizing: border-box!important;
        padding: 10px 0;
    }

    .settingsButton{
        background-color: #fec02c;
        color:#000;
        border:none;
        padding: 0;
        margin: 0 auto;
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

    .settingsTitle{
        font-size: 16px;
        line-height: 26px;
        text-transform: capitalize;
    }

    .poolSettingsRow input, .poolSettingsRow textarea{
        border-radius: 3px;
        padding: 10px 5px;
        width: 100%;
        background-color: #262626;
        border: solid 1px #3e3e3e;
        color:#fff
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

    .poolSlider .miningSlider{
        border: solid 1px #3e3e3e;
        border-radius:5px
    }

    .vue-slider-component .vue-slider-tooltip{
        background-color: #3c3a3a!important;
        margin-bottom: 2px;
        border: solid 1px #3e3e3e!important;
    }

</style>
