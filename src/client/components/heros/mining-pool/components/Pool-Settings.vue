<template>

    <div>

        <h2>SETTINGS</h2>

        <div class="smallSettings">

            <div class="poolSettingsRow">
                <div class="settingsTitle">
                    Name:
                </div>
                <div>
                    <input type="text" class="input" v-model="poolName" placeholder="WebDollar Pool">
                </div>
            </div>

            <div class="poolSettingsRow">
                <div class="settingsTitle">
                    URL:
                </div>
                <div>
                    <input type="text" class="input" v-model="poolURL" placeholder="http://url" >
                </div>
            </div>

            <div class="poolSettingsRow">
                <div class="settingsTitle">
                    FEE Percent:
                </div>
                <div>
                    <input type="text" class="input" v-model="poolFee" placeholder="10" >
                </div>
            </div>

            <div class="poolSettingsRow">
                <div class="settingsTitle">
                    Servers:
                </div>
                <div>
                    <input type="text" class="input" v-model="poolServers" placeholder="832.213.23.21:312; 32.123.12.312:221">
                </div>
            </div>

        </div>

        <div class="buttonContainer">
            <button @click="handleSaveSettings" class="minerData buttonSmall settingsButton">Save Settings</button>
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
                poolFee: 0,
                poolName: '',
                poolURL: '',
                poolServers: ''
            }

        },

        methods: {

            handleChangePoolFee(value){
                this.poolFee = value;
            },

            handleSaveSettings(){

                WebDollar.Blockchain.PoolManagement._poolFee =  this.poolFee;
                WebDollar.Blockchain.PoolManagement._poolName = this.poolName;
                WebDollar.Blockchain.PoolManagement._poolURL = this.poolURL;

                WebDollar.Blockchain.PoolManagement._savePoolDetails();

            }

        }

    }

</script>

<style>

    .poolSettingsRow{
        display: grid;
        grid-template-columns: 100px 1fr;
    }

    .settingsButton{
        background-color: #fec02c;
        color:#000;
        border:none;
        padding: 5px 20px;
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
        font-size: 14px;
        text-transform: capitalize;
    }

    .poolSettingsRow input{
        background-color: #e4e4e4;
        border: solid 1px #ffffff;
        border-radius: 3px;
        width: 100%;
    }

</style>

