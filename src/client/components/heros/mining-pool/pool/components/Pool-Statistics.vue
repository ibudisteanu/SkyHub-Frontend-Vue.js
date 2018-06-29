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
                Pool Status: <span class="normalSpan Uppercase" :class="this.selectStatusColor">{{ this.poolStatus }}</span>
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
                Pool Power: <span class="normalSpan yellowColor"> {{this.getPoolPower }}% </span>
            </span>
            <span class="oneLineText">
                Miners in pool: <span class="normalSpan" :class="this.isNotNullColor"> {{this.poolMinersOnline}} </span>
            </span>
            <span class="oneLineText">
                Blocks confirmed: <span class="normalSpan" :class="this.isNotNullColor"> {{this.poolBlocksConfirmed}} </span>
            </span>
            <span class="oneLineText">
                Blocks unconfirmed: <span class="normalSpan" :class="this.isNotNullColor"> {{this.poolBlocksUnconfirmed}} </span>
            </span>
            <span class="oneLineText">
                Time to next block: <span class="normalSpan" :class="this.isNotNullColor"> {{this.showPoolRemainingTime}} </span>
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
            poolBlocksConfirmed: 0,
            poolBlocksUnconfirmed: 0,
            poolTimeRemaining: 0,
            networkHashRate:0
        },

        computed:{

            getPoolPower(){
                return Utils.showHashes(this.poolHashes/this.networkHashRate*100)
            },

            showPoolRemainingTime(){

                if (this.poolTimeRemaining === undefined || this.poolTimeRemaining === -1) return `na`;

                let time = this.poolTimeRemaining;

                let y = Math.floor(time / (12*30*7*24*60*60));
                time %= (12*30*7*24*60*60);

                let mo = Math.floor(time / (30*7*24*60*60));
                time %= (30*7*24*60*60);

                let w = Math.floor(time / (7*24*60*60));
                time %= (7*24*60*60);

                let d = Math.floor(time / (24*60*60));
                time %= (24*60*60);

                let h = Math.floor(time / (60*60));
                time %= (60*60);

                let m = Math.floor(time / (60));
                time %= (60);

                let s = Math.floor(time );

                return (y !== 0 ? ` ${y} y` : ``)+(mo !== 0 ? ` ${mo} mo` : ``)+(w !== 0 ? ` ${w} w` : ``)+(d !== 0 ? ` ${d} d` : ``)+(h !== 0 ? ` ${h} h` : ``)+(m !== 0 ? ` ${m} m` : ``)+(s !== 0 ? ` ${s} s` : ``)
            },

            numberOfConnectedHosts(){

                let enabledHosts = 0;

                for(var key in this.poolServers)
                    if (this.poolServers[key].connected) enabledHosts++;

                return enabledHosts;

            },

            isNotNullColor(){

                if (this.numberOfConnectedHosts===0) return 'redColor';

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

                let onlineServersNumber = this.numberOfConnectedHosts;

                if (onlineServersNumber===0) return 'Offline';

                return onlineServersNumber + ' / ' + Object.keys(this.poolServers).length;

            },


            getHashrate(){
                return Utils.showHashes(this.poolHashes);
            },

            getHashrateSign(){
                return Utils.showHashesSign(this.poolHashes);
            }

        },

        methods:{



        },

        mounted(){

            if (typeof window === "undefined") return;

            // Should be recieved from pool leader
            if (WebDollar.Blockchain.synchronized){

                //this.networkHashRate = WebDollar.Blockchain.Chain.blocks.networkHashRate;

            }

        }

    }

</script>
