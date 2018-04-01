<template>

    <layout>

        <div slot="content">

            <div style="margin-top: 200px; margin-left: 100px; margin-bottom: 900px">
                <button style="background-color: yellow; height: 100px" @click="clearIndexedDB">Clear IndexedDB</button>
            </div>

        </div>

    </layout>

</template>

<script>

    import Layout from "client/components/layout/Layout.vue"

    export default{

        name: "transactions-page",

        components: {
            "layout": Layout,
        },

        methods:{

            clearIndexedDB(){

                window.indexedDB.deleteDatabase('_pouch_validateDB');
                window.indexedDB.deleteDatabase('_pouch_defaultDB');
                window.indexedDB.deleteDatabase('_pouch_walletDB');
                window.indexedDB.deleteDatabase('_pouch_blockchainDB3');
                window.indexedDB.deleteDatabase('_pouch_blockchainDB2');
                window.indexedDB.deleteDatabase('_pouch_blockchainDB');

                window.localStorage.removeItem("_pouch_check_localstorage");
                window.localStorage.removeItem("_pouch_validateDB");
                window.localStorage.removeItem("_pouch_defaultDB");
                window.localStorage.removeItem("_pouch_blockchainDB3");
                window.localStorage.removeItem("_pouch_blockchainDB2");
                window.localStorage.removeItem("_pouch_validateDB");
                window.localStorage.removeItem("_pouch_walletDB");

                alert("The indexedDB was cleared!");

                this.getAllIndexedDBs();
            },

            getAllIndexedDBs(){

                window.indexedDB.webkitGetDatabaseNames().onsuccess = function(sender,args) {
                    var r = sender.target.result;
                    for(var i in r)
                        indexedDB.deleteDatabase(r[i]);
                };

            }

        }

    }

</script>