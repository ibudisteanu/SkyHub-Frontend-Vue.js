<template>

    <div>

        <h2>SET YOUR POOL FEE</h2>
        <slider ref="refMiningSlider" @changed="this.handleChangePoolFee"/>

        <h2>POOL NAME</h2>
        <input type="text" class="input" v-model="poolName" value="POOL NAME" ><br>

        <h2>POOL URL</h2>
        <input type="text" class="input" v-model="poolURL" placeholder="http://url" ><br>

        <span class="minerData buttonSmall selected" @click="handleSaveSettings">Save Settings</span>

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

