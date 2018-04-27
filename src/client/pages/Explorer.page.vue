<template>

    <div>

        <layout class="bountyProgramPage" v-show="!protocolUsedOnMultipleTabs">

            <div slot="content">

                <address-explorer/>

            </div>

        </layout>

        <multiple-tabs v-show="protocolUsedOnMultipleTabs"/>

    </div>

</template>

<script>

    import Layout from "client/components/layout/Layout.vue";
    import AddressExplorer from "client/components/heros/explorer/list/AddressBalances-List.vue";
    import MultipleTabs from "../components/heros/Multiple-Tabs.hero.vue";

    export default {

        name: "ViewHome",

        components:{
            Layout,
            AddressExplorer,
            MultipleTabs
        },

        data: () => {
            return {
                protocolUsedOnMultipleTabs: false
            }
        },

        mounted(){

            if (typeof window === "undefined") return false;

            WebDollar.StatusEvents.on("blockchain/status", (data)=>{

                if (data.message === "Single Window") {

                    this.protocolUsedOnMultipleTabs= false;

                }else
                if (data.message === "Multiple Windows Detected"){

                    this.protocolUsedOnMultipleTabs=true;

                }

            });

        }

    }

</script>