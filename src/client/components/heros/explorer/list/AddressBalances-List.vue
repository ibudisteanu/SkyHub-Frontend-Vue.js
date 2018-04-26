<template>

    <div class="balanceExp">

        <h1>Balances</h1>

        <loading-spinner class="bountySpinner" v-if="this.data===false" />

        <div v-if="this.data!==false" class="list balancesExplorer">

            <div class="listHead listElement list">
                <div>No.</div>
                <div>Address</div>
                <div>Balance</div>
            </div>

            <div class="listElement list" v-for="(element, index) in this.data" :key="'balances '+index">
                <div>{{index}}</div>
                <div>{{element.address}}</div>
                <div class="title">{{formatMoneyNumber(element.balance,2)}}</div>
            </div>

        </div>

    </div>

</template>

<script>

    import LoadingSpinner from "client/components/UI/elements/Loading-Spinner.vue"

    export default{

        components:{ LoadingSpinner },

        data: () => {
            return {
                data: false
            }
        },

        methods:{

            formatMoneyNumber(n, decimals=0) {

                var number = parseInt(n/WebDollar.Applications.CoinsHelper.WEBD);
                var decimalNumber = this.getNumberRest(n);

                return this.formatIntNumber(number)+'.'+this.getFirstDigits(decimalNumber,decimals);

            },

            formatIntNumber(number){

                return number.toString().replace(/./g, function(c, i, a) {
                    return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
                });

            },

            getNumberRest(number){

                return number % WebDollar.Applications.CoinsHelper.WEBD;

            },

            getFirstDigits(number,decimals){

                var decimalsVerifier = Math.pow(10,decimals);
                var newNumber = '';

                if(number<10){

                    newNumber='000'+number.toString();

                }else if(number<100){

                    newNumber='00'+number.toString();

                }else if(number<1000){

                    newNumber='0'+number.toString();

                }else if(number<10000){

                    newNumber=''+number.toString();

                }

                return newNumber.substring(0,decimals);

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