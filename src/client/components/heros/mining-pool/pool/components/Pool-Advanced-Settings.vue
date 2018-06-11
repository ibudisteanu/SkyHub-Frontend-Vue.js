<template>

    <div>

        <h2 class="alignCenter yellowColor">SETTINGS</h2>

        <div class="smallSettings largePadding">

            <div>

                <div class="poolSettingsRow">
                    <div class="settingsTitle feeHeight">
                        FEE Percent:
                    </div>
                    <slider ref="refBar" @changed="this.handleSaveSettings"/>
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

            </div>

        </div>

        <div class="buttonsContainer">

            <div class="buttonContainer">
                <button @click="handleSaveSettings" class="minerData buttonSmall settingsButton">Save Settings</button>
                {{this.error}}
            </div>
            <div class="buttonContainer">

                <button @click="copyClipboardPoolURL" class="minerData buttonSmall settingsButton" style="margin-bottom: 20px">Copy Pool Invite URL</button>

                <p>{{this.poolURL}}</p>

            </div>

        </div>

    </div>

</template>

<script>

    import slider from 'client/components/UI/elements/Slider.vue';

    export default{

        components: {
            "slider":slider
        },

        data: ()=>{

            return {
                loaded:false,

                poolFee: 0,
                poolName: '',
                poolWebsite: '',

                poolServers: '',
                poolURL: '',
                error: '',
            }

        },

        methods: {

            handleChangePoolFee(value){
                this.poolFee = value;
            },

            async handleSaveSettings(){

                WebDollar.Blockchain.PoolManagement.poolSettings._poolFee =  this.poolFee;
                WebDollar.Blockchain.PoolManagement.poolSettings._poolName = this.poolName;
                WebDollar.Blockchain.PoolManagement.poolSettings._poolWebsite = this.poolWebsite;
                WebDollar.Blockchain.PoolManagement.poolSettings._poolServers = this.poolServers;

                try {

                    await WebDollar.Blockchain.PoolManagement.poolSettings.savePoolDetails();
                    this.error = '';

                } catch (exception){

                    this.error = exception.message;

                }

            },

            copyClipboardPoolURL(){

            },

            async loadData(){

                this.load=true;

                this.poolName = WebDollar.Blockchain.PoolManagement.poolSettings.poolName;
                this.poolFee = WebDollar.Blockchain.PoolManagement.poolSettings.poolFee;
                this.poolServers = WebDollar.Blockchain.PoolManagement.poolSettings.poolServers;
                this.poolWebsite = WebDollar.Blockchain.PoolManagement.poolSettings.poolWebsite;
                this.poolURL = await WebDollar.Blockchain.PoolManagement.poolSettings.poolURL;

                this.$refs['refBar'].value = this.poolFee;

                this.load=true;

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

        }

    }

</script>

<style>

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
        grid-template-columns: 1fr 1fr;
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
