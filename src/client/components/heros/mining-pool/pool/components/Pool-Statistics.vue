<template>

    <div class="distributionGrid poolDescription">

        <div class="verticalAlignMiddle">

            <span class="oneLineText">
                Your Role: <span class="normalSpan yellowColor"> Miner </span>
            </span>
            <span class="oneLineText">
                Pool Name:
                <select v-model="poolsListSelected" class="poolSelect">
                    <option>Pool Mining Disabled</option>
                    <option v-for="(poolListElement, index) in this.poolsList">
                        {{poolListElement.poolName}}
                    </option>
                </select>
            </span>
            <span class="oneLineText">
                Pool Status: <span class="normalSpan" :class="this.selectStatusColor">{{ this.poolStatus }}</span>
            </span>
            <span class="oneLineText">
                Pool Fee: <span class="normalSpan yellowColor"> <a :href="this.poolWebsite"> {{this.poolFee}} %</a></span>
            </span>
            <span class="oneLineText">
                Online Hosts: <span class="normalSpan" :class="this.selectOnlineHostColor"> {{ this.onlineHosts }} </span>
            </span>
            <span class="oneLineText">
                Pool Hash: <span class="normalSpan yellowColor"> {{this.getHashrate }} {{this.getHashrateSign}}</span>
            </span>
            <span class="oneLineText">
                Miners in pool: <span class="normalSpan" :class="this.isNotNullColor"> {{this.poolMinersOnline}} </span>
            </span>

        </div>

    </div>

</template>

<script>
    import Utils from 'src/utils/util-functions'

    export default{

        props: {
            poolName: '',
            poolWebsite: '',
            poolURL: '',
            poolFee: '',
            poolServers: {},
            poolsList: {},
            poolsListSelected: '',
            poolStatus: '',

            poolHashes: 0,
            poolMinersOnline: 0,
        },

        computed:{

            numberOfConnectedHosts(){

                let enabledHosts = 0;

                for(let i=0;i<=this.poolServers;i++)
                    if (this.poolServers[i].connected === true ) enabledHosts++;

                return enabledHosts;

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

                if(this.numberOfConnectedHosts===0)  return 'redColor';

                if (Object.keys(this.poolServers).length === this.numberOfConnectedHosts) return 'greenColor';

                return 'yellowColor'

            },

            onlineHosts(){

                return this.numberOfConnectedHosts + ' / ' + Object.keys(this.poolServers).length;

            },


            getHashrate(){
                return Utils.showHashes(this.poolHashes);
            },

            getHashrateSign(){
                return Utils.showHashesSign(this.poolHashes);
            }

        },

        methods:{



        }

    }

</script>
