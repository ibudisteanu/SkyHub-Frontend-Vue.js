<template>

    <div class="poolSectionContainer">

        <div v-if="this.displayType==='normal'" class="poolContainer">

            <div v-for="(element, index) in this.minersList" :key="'miningPoolListElement '+index"  class="miner" :class="element.active===true ? 'activeMiner' : ''"  @click="selectMiner(index)">
                <img alt="picker" src="public/assets/images/picker.png"/>
                <span class="status">{{element.active===true ? 'Mining' : 'Offline'}}</span>
            </div>

        </div>

        <div v-if="this.displayType==='list'" class="list">

            <div class="transactionInfo tableHeader">

                <span>Status</span>
                <span>Instances</span>
                <span>Invitated</span>
                <span>Next Reward</span>
                <span>Total WIN</span>

            </div>

            <div v-for="(element, index) in this.minersList" :key="'miningPoolListElement '+index" @click="selectMiner(index)" class="transactionInfo">

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Status:</span>
                    <span class="status" :class="element.active===true ? 'yellowText' : ''">{{element.active===true ? 'Mining' : 'Offline'}}</span>
                </div>

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Instances:</span>
                    <span class="time">{{element.instances.length}}</span>
                </div>

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Invitated:</span>
                    <span class="time">{{element.referrals.length}}</span>
                </div>

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Next Reward:</span>
                    <span class="time">{{this.getNextReward(element)}}</span>
                </div>

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Total Win:</span>
                    <span class="size yellowText">{{element.avaiableReward}}</span>
                </div>

            </div>

        </div>

    </div>

</template>

<script>

    export default{

        props: {
            displayType: {default: 'list'},
            minersList: {default: []}
        },

        methods:{

            selectMiner(index){

                this.$emit('selectMiner', index);

            },

            getNextReward(element){
                return element._rewardTotal - element._rewardSent;
            }

        }

    }

</script>

<style>

    .miner{
        transition: none;
    }

</style>