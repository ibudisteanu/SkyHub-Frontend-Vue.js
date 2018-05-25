<template>

    <div class="poolSectionContainer">

        <div v-if="this.displayType==='normal'" class="poolContainer">

            <div v-for="(element, index) in this.minersList" :key="'InstagramRankingListElement '+index"  class="miner" :class="element.active===true ? 'activeMinner' : ''">
                <img alt="picker" src="public/assets/images/picker.png"/>
                <span class="status">{{element.active===true ? 'Mining' : 'Offline'}}</span>
            </div>

        </div>

        <div v-if="this.displayType==='list'" class="list">

            <div v-for="(element, index) in this.minersList" :key="'InstagramRankingListElement '+index" class="transactionInfo">
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

        data: () => {
            return {
                displayType: 'list',
                minersList: [
                    {
                        active: true,
                        address: 'WEBD$gCPE#0MUG@ReQk3wD7EB5vmMGDdo#YhHSr$',
                        nextReward: '200',
                        avaiableReward: '20000',
                        averageHash: '',
                    },
                    {
                        active: false
                    },
                    {
                        active: true
                    },
                    {
                        active: false
                    },
                    {
                        active: true
                    },
                    {
                        active: false
                    },
                    {
                        active: true
                    },
                    {
                        active: false
                    },
                    {
                        active: false
                    },
                    {
                        active: true
                    },
                    {
                        active: false
                    },
                    {
                        active: true
                    },
                    {
                        active: false
                    },
                    {
                        active: true
                    },
                    {
                        active: false
                    },
                    {
                        active: false
                    },
                    {
                        active: true
                    },
                    {
                        active: false
                    },
                    {
                        active: true
                    },
                    {
                        active: false
                    },
                    {
                        active: true
                    },
                    {
                        active: false
                    }
                ]
            }
        },

    }

</script>