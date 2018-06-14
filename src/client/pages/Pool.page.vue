<template>

    <div>

        <Layout v-show="!protocolUsedOnMultipleTabs">

            <div slot="content">

                <pool-admin-panel/>

            </div>

        </Layout>

        <multiple-tabs v-show="protocolUsedOnMultipleTabs"/>

    </div>

</template>

<script>

    import Layout from "client/components/layout/Layout.vue"
    import PoolAdminPanel from "client/components/heros/mining-pool/pool/Pool-Admin.Panel.vue"
    import MultipleTabs from "../components/heros/Multiple-Tabs.hero.vue";

    export default {

        name: "pool-page",

        components:{
            Layout,
            PoolAdminPanel,
            MultipleTabs,
        },

        data: ()=> {
            return {
                protocolUsedOnMultipleTabs: false,
            }
        },

        mouted(){

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