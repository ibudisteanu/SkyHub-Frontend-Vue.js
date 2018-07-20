<template>

    <div class="distributionGrid poolDescription">

        <div class="verticalAlignMiddle">

            <span class="oneLineText">
                Your Role: <span class="normalSpan yellowColor"> {{statsType}} </span>
            </span>
            <span class="oneLineText">

                Pool Name:
                <select v-model="poolsListSelected" class="poolSelect" @change="handlePoolSelect">
                    <option class="poolSelectOption" >Pool Mining Disabled</option>
                    <option v-for="(poolListElement, index) in this.poolsList" class="poolSelectOption"  >
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
                To be Paid: <span class="normalSpan" :class="this.isNotNullColor"> {{this.poolBlocksConfirmed}} </span> Paid already: <span class="normalSpan" :class="this.isNotNullColor"> {{this.poolBlocksConfirmedAndPaid}} </span> <br/>
                Being confirmed: <span class="normalSpan" :class="this.isNotNullColor"> {{this.poolBlocksBeingConfirmed}} </span> Unconfirmed <span class="normalSpan" :class="this.isNotNullColor"> {{this.poolBlocksUnconfirmed}} </span>
            </span>

            <span class="oneLineText">
                Time to next block: <span class="normalSpan" :class="this.isNotNullColor"> {{this.showPoolRemainingTime}} </span>
            </span>


            <span v-if="this.statsType === 'miner' " class="oneLineText">
                Referral Potential Reward: <span class="normalSpan" :class="this.isNotNullColor"> {{this.referralPotential}} WEBD</span>
            </span>


        </div>

    </div>

</template>

<script>

    import Vue from 'vue';
    import Utils from 'src/utils/util-functions'

    export default{

        data: ()=>{
            return {

                poolsList: {},
                poolsListSelected: '',

            }
        },

        props: {

            statsType: {default: 'pool'},


            poolName: '',
            poolWebsite: '',
            poolURL: '',
            poolFee: 0,
            poolReferralFee: 0,
            poolServers: {},
            poolStatus: '',

            poolHashes: 0,
            poolMinersOnline: 0,
            poolBlocksConfirmed: 0,
            poolBlocksConfirmedAndPaid: 0,
            poolBlocksUnconfirmed: 0,
            poolBlocksBeingConfirmed: 0,
            poolTimeRemaining: 0,
            networkHashRate:0,

            rewardReferralTotal:0,
            rewardReferralConfirmed:0,
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

                for(let key in this.poolServers)
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
            },

            referralPotential(){

              if (typeof window === "undefined") return 0;

              return  this.rewardReferralTotal / WebDollar.Applications.CoinsHelper.WEBD ;
            }

        },

        methods:{

            handlePoolSelect(){

                let poolName = this.poolsListSelected;
                let value;

                if (poolName === "Pool Mining Disabled")
                    value = false;
                else {

                    for (let key in this.poolsList)
                        if (this.poolsList[key].poolName === poolName){
                            value = this.poolsList[key].poolURL;
                            break;
                        }

                }

                WebDollar.Blockchain.MinerPoolManagement.startMinerPool( value , true) ;

            },

            setPoolsList(list){
                this.poolsList = list;
            },


            loadPoolData(){

                if ( WebDollar.Blockchain.MinerPoolManagement === undefined){

                } else {

                    let poolsList = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolsList;

                    this.poolsList = {};
                    for (let key in poolsList)
                        Vue.set(this.poolsList, key, poolsList[key]);

                    let minerPoolFound = false;

                    if (WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.minerPoolActivated) {

                        let minerPoolPublicKey = WebDollar.Blockchain.MinerPoolManagement.minerPoolSettings.poolPublicKey.toString("hex");

                        for (let poolPublicKey in poolsList)
                            if (poolPublicKey === minerPoolPublicKey) {
                                this.poolsListSelected = poolsList[poolPublicKey].poolName;
                                minerPoolFound = true;
                                break;
                            }


                    }

                    if (!minerPoolFound)
                        this.poolsListSelected = 'Pool Mining Disabled';

                }


            },

        },

        mounted(){

            if (typeof window === "undefined") return;

            // Should be recieved from pool leader
            if (WebDollar.Blockchain.synchronized){

                //this.networkHashRate = WebDollar.Blockchain.Chain.blocks.networkHashRate;

            }

            WebDollar.StatusEvents.on("miner-pool/settings",data =>  this.loadPoolData() );

            this.loadPoolData();

        }

    }

</script>

<style>

    .poolSelectOption{

        background-color: #8d8d8d;

    }

</style>
