<template>

    <div>

        <layout class="bountyProgramPage" v-show="!protocolUsedOnMultipleTabs">

            <div slot="content">

                <ranking-list/>

            </div>

        </layout>

        <multiple-tabs v-show="protocolUsedOnMultipleTabs"/>

    </div>

</template>

<script>

    import Layout from "client/components/layout/Layout.vue";
    import RankingList from "client/components/heros/bounty/Ranking-List.hero.vue";

    export default {

        name: "ViewHome",

        components:{
            "layout": Layout,
            RankingList
        },

        data: () => {
            return {
                protocolUsedOnMultipleTabs: false
            }
        },

        mounted(){

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