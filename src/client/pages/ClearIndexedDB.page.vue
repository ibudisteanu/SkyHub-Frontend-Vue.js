<template>

    <layout>

        <div slot="content">

            <div style="margin-top: 300px; margin-left: 200px; margin-bottom: 900px">
                <button style="background-color: yellow" @click="clearIndexedDB">Clear IndexedDB</button>
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
                window.indexedDB.deleteDatabase('_pouch_blockchainDB3');
                window.indexedDB.deleteDatabase('_pouch_blockchainDB2');
                window.indexedDB.deleteDatabase('_pouch_blockchainDB');

                this.getAllIndexedDBs();
            },

            getAllIndexedDBs(){

                window.indexedDB.webkitGetDatabaseNames().onsuccess = function(sender,args)
                {
                    var r = sender.target.result;
                    for(var i in r)
                        indexedDB.deleteDatabase(r[i]);
                };

            }

        }

    }

</script>