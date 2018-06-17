<template>

    <div class="distributionGrid poolDescription">

        <div class="verticalAlignMiddle">

            <span class="oneLineText">
                Your Role: <span class="normalSpan yellowColor"> Miner </span>
            </span>
            <span class="oneLineText">
                Pool Name:
                <select v-model="statistics.poolsListSelected" class="poolSelect">
                    <option>Pool Mining Disabled</option>
                    <option v-for="(poolListElement, index) in this.statistics.poolsList">
                        {{poolListElement.poolName}}
                    </option>
                </select>
            </span>
            <span class="oneLineText">
                Pool Status: <span class="normalSpan" :class="this.selectStatusColor()">{{ this.statistics.minerPoolStatus }}</span>
            </span>
            <span class="oneLineText">
                Pool Fee: <span class="normalSpan yellowColor"> <a :href="this.statistics.poolWebsite"> {{this.statistics.poolFee}} </a></span>
            </span>
            <span class="oneLineText">
                Online Hosts: <span class="normalSpan" :class="this.selectOnlineHostColor()"> {{ this.onlineHosts() }} </span>
            </span>
            <span class="oneLineText">
                Pool Hash: <span class="normalSpan yellowColor"> 500 MH/s </span>
            </span>
            <span class="oneLineText">
                Miners in pool: <span class="normalSpan" :class="this.isNotNullColor()"> {{this.statistics.poolMinerNumber}} </span>
            </span>

        </div>

    </div>

</template>

<script>

    export default{

        props: {
            statistics: {default: {}}
        },

        methods:{

            numberOfConnectedHosts(){

                var enabledHosts=0;

                for(var i=0;i<=this.poolServers;i++){

                    if(this.poolServers.connected === true) enabledHosts++

                }

                return enabledHosts;

            },

            isNotNullColor(){

                if (this.statistics.poolMinerNumber===0) return 'redColor';

                return 'greenColor';

            },

            selectStatusColor(){

                if (this.poolStatus==='Started') return 'greenColor';
                if (this.poolStatus==='Configured') return 'redColor';

                return 'yellowColor';

            },

            selectOnlineHostColor(){

                if(this.numberOfConnectedHosts()===0)  return 'redColor';

                if (Object.keys(this.statistics.poolServers).length=== this.numberOfConnectedHosts()) return 'greenColor';

                return 'yellowColor'

            },

            onlineHosts(){

                return this.numberOfConnectedHosts() + ' / ' + Object.keys(this.statistics.poolServers).length;

            },

        }

    }

</script>
