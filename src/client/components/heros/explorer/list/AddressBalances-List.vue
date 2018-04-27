<template>

    <div class="balanceExp">

        <h1>Balances</h1>

        <loading-spinner class="bountySpinner" v-if="this.data===false" />

        <div v-if="this.data!==false" class="list balancesExplorer">

            <chart :data="this.removeNullAddresses(this.data)" class="balanceChart" ></chart>

            <div class="listHead listElement list">
                <div>No.</div>
                <div>C</div>
                <div>Address</div>
                <div>Balance</div>
            </div>

            <div class="listElement list" v-for="(element, index) in this.removeNullAddresses(this.data)" :key="'balances '+index">
                <div>{{index}}</div>
                <div :style="{backgroundColor: Utils.generateRandomcolor(element.address)}"></div>
                <div class="address">{{element.address}}</div>
                <div class="title">{{Utils.formatMoneyNumber(element.balance)}}</div>
            </div>

        </div>

    </div>

</template>

<script>

    import LoadingSpinner from "client/components/UI/elements/Loading-Spinner.vue";
    import Chart from "client/components/UI/elements/Chart.vue"
    import Utils from 'src/utils/util-functions'

    export default{

        components:{ LoadingSpinner, Chart },

        data: () => {
            return {
                data: false
            }
        },

        methods:{

            removeNullAddresses(data){

                var newData =[];

                console.log("############",data);

                for (var i=0; i<data.length; i++)
                    if (data[i].balance >= 10000) newData.push(data[i]);

                return newData;

            }

        },

        computed:{

            Utils(){
                return Utils;
            }

        },

        mounted(){

            if (typeof window === "undefined") return false;

            if (WebDollar.Blockchain.synchronized){
                this.data = WebDollar.Blockchain.AccountantTree.getAccountantTreeList();
            }

            WebDollar.StatusEvents.emitter.on("blockchain/status", (data)=>{

                if (data.message === "Blockchain Ready to Mine")
                    this.data = WebDollar.Blockchain.AccountantTree.getAccountantTreeList();

            });


        }

    }

</script>

<style>

    .balanceChart{
        padding: 40px 0 40px 0;
    }

</style>