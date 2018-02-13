<template>

    <layout>

        <div slot="content">

            <div id="transactions">
        <div id="transactionContainer">
            <div class="transactionInfo">
                <span class="id">53143</span>
                <span class="time">1 min ago</span>
                <span class="transactions">3 transactipons</span>
                <span class="minedBy">mined by fas as gsag sagsg as gasd gsa gsa</span>
                <span class="size">400bytes</span>
            </div>
            <div class="transactionInfo">
                <span class="id">53143</span>
                <span class="time">1 min ago</span>
                <span class="transactions">3 transactipons</span>
                <span class="minedBy">mined by fas as gsag sagsg as gasd gsa gsa</span>
                <span class="size">400bytes</span>
            </div>
            <div class="transactionInfo">
                <span class="id">53143</span>
                <span class="time">1 min ago</span>
                <span class="transactions">3 transactipons</span>
                <span class="minedBy">mined by fas as gsag sagsg as gasd gsa gsa</span>
                <span class="size">400bytes</span>
            </div> <div class="transactionInfo">
            <span class="id">53143</span>
            <span class="time">1 min ago</span>
            <span class="transactions">3 transactipons</span>
            <span class="minedBy">mined by fas as gsag sagsg as gasd gsa gsa</span>
            <span class="size">400bytes</span>
        </div>

        </div>
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
        }

    }

</script>