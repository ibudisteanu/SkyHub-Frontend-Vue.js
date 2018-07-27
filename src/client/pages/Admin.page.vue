<template>

    <div>

        <Layout v-show="!protocolUsedOnMultipleTabs">

            <div slot="content">

                <admin-panel/>

            </div>

        </Layout>

        <multiple-tabs v-show="protocolUsedOnMultipleTabs"/>

    </div>

</template>

<script>

    import Layout from "client/components/layout/Layout.vue"
    import AdminPanel from "client/components/heros/mining-pool/Admin.Panel.vue"
    import MultipleTabs from "../components/heros/Multiple-Tabs.hero.vue";

    export default {

        name: "admin-page",

        components:{
            Layout,
            AdminPanel,
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