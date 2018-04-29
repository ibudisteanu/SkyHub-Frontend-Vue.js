<template>

    <div class="transactionElement">
        <div v-if="this.showElement" >
            <div class="transactions" v-for="(element, index) in this.data">
                <div title="From" class="alignCenter">{{getAddress(element.from.addresses[0].unencodedAddress)}}</div>
                <div title="To" class="alignCenter">{{getAddress(element.to.addresses[0].unencodedAddress)}}</div>
                <div title="Transferred Amount" class="alignCenter">{{getAmount(element.to.addresses[0].amount,0)}}</div>
                <div title="fee" class="alignCenter">{{getAmount(element.from.addresses[0].amount - element.to.addresses[0].amount,2)}}</div>
            </div>
        </div>
    </div>

</template>

<script>

    import Utils from 'src/utils/util-functions'

    export default{

        props: ['data'],

        data: () => {
            return {
                showElement: false
            }
        },

        methods:{

            showForm(){
                if (this.showElement) this.showElement = false;
                    else this.showElement = true;
            },

            getAddress(address){
                return WebDollar.Applications.BufferExtended.toBase(WebDollar.Applications.AddressHelper.generateAddressWIF(address))
            },

            getAmount(amount,decimals){
                return Utils.formatMoneyNumber(amount,decimals);
            }

        },

        computed:{

            Utils(){
                return Utils;
            }

        },

        mounted(){

            if (typeof window === "undefined") return false;

        }

    }

</script>

<style>

    .transactions{
        font-size: 12px;
        display: grid;
        grid-template-columns: 1fr 1fr 100px 52px;
        border-left:solid 1px #444444;
        border-right:solid 1px #444444;
        background-color: #545454;
        grid-gap: 1px;
        box-sizing: border-box!important;
    }

    .transactions div{
        padding: 10px 0;
        width: 100%;
        background-color: #3c3c3c;
    }

</style>