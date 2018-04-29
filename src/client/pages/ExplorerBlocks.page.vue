<template>

    <div>

        <layout class="bountyProgramPage" v-show="!protocolUsedOnMultipleTabs">

            <div slot="content">

                <div class="header">

                    <div class="explorerButton" @click="selectNewItem('balances')">
                        Balances
                    </div>
                    <div class="explorerButton" @click="selectNewItem('blocks')">
                        Blocks
                    </div>

                </div>

                <div class="content">
                    <blocks-explorer v-if="this.showElement==='blocks'"></blocks-explorer>
                    <address-explorer v-if="this.showElement==='balances'"/>
                </div>

            </div>

        </layout>

        <multiple-tabs v-show="protocolUsedOnMultipleTabs"/>

    </div>

</template>

<script>

    import Layout from "client/components/layout/Layout.vue";
    import BlocksExplorer from "client/components/heros/explorer/list/Blocks-List.vue";
    import AddressExplorer from "client/components/heros/explorer/list/AddressBalances-List.vue";
    import MultipleTabs from "../components/heros/Multiple-Tabs.hero.vue";



    export default {

        name: "ViewHome",

        components:{ Layout, BlocksExplorer, MultipleTabs, AddressExplorer },

        data: () => {
            return {
                protocolUsedOnMultipleTabs: false,
                showElement: 'blocks'
            }
        },
       mounted(){

            if (typeof window === "undefined") return false;

            this.selectNewItem( this.$route.params.a );

            WebDollar.StatusEvents.on("blockchain/status", (data)=>{

                if (data.message === "Single Window") {

                    this.protocolUsedOnMultipleTabs= false;

                }else
                if (data.message === "Multiple Windows Detected"){

                    this.protocolUsedOnMultipleTabs=true;

                }

            });

        },

        methods:{

            selectNewItem(item){

                var url = window.location.href;
                var index = url.lastIndexOf("explorer");
                var urlPrefix = url.substring(0, index+8);

                if (item!==undefined) url = urlPrefix+'/'+item;

                if (item === 'blocks') {
                    this.showElement = 'blocks';
                }
                if (item === 'balances') {
                    this.showElement = 'balances';
                }

                window.history.pushState('','', url);

            }

        }

    }

</script>

<style>

    .header{
        padding-top: 65px;
        width: 95px;
        background-color: #525252;
        display: block;
        height: 100%;
        position: fixed;
    }

    .header .explorerButton{
        text-align: center;
        font-weight: bolder;
        text-transform: uppercase;
        font-size: 14px;
        padding: 20px 0;
        transition: all .5s linear;
        cursor: pointer;
    }

    .header .explorerButton:hover{
        text-align: center;
        padding: 20px 0;
        background-color: #fec02c;
        color:#000;
        transition: all .5s linear;
    }

    .content{
        margin-left: 95px;
    }

    @media screen and (max-width: 600px){

        .header{
            width: 100%;
            height: 57px;
            display: grid;
            grid-template-columns: 1fr 1fr;
        }

        .content{
            margin-left: 0;
        }

    }

</style>