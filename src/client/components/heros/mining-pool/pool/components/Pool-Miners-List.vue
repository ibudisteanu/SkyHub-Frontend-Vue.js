<template>

    <div class="poolSectionContainer">

        <div v-if="this.displayType==='normal'" class="poolContainer">

            <div v-for="(element, index) in this.minersList" :key="'miningPoolListElement '+index"  class="miner" :class="element.active===true ? 'activeMinner' : ''">
                <img alt="picker" src="public/assets/images/picker.png"/>
                <span class="status">{{element.active===true ? 'Mining' : 'Offline'}}</span>
            </div>

        </div>

        <div v-if="this.displayType==='list'" class="list">

            <div v-for="(element, index) in this.minersList" :key="'miningPoolListElement '+index" class="transactionInfo">
                <span class="status" :class="element.active===true ? 'yellowText' : ''">{{element.active===true ? 'Mining' : 'Offline'}}</span>
                <span class="time">{{element.nextReward + ' WEBD'}}</span>
                <span class="minedBy">{{element.address}}</span>
                <span class="size yellowText">{{element.avaiableReward}}</span>
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

    }

</script>

<style>

    .miner{
        transition: none;
    }

</style>