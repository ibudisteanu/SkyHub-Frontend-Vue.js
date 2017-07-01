<template>

    <div class="vote-actions">
        <i class="fa fa-chevron-up" v-on:click="increment"> </i>
        <div v-if="myVotingValue >0">
            {{myVotingValue}}
        </div>
        <div v-else>
            -
        </div>
        <i class="fa fa-chevron-down" v-on:click="decrement"> </i>
    </div>
</template>

<script>

    import Voting from 'models/Vote/Voting.model'

    export default {

        name: 'Voting',

        components: {
        },

        props: {
            voteId : { default: '' }
        },

        computed:{

            voting(){

            }

        },

        data: function () {

        },

        mounted: function () {


        },
        methods: {
            increment() {
                this.myVotingValue++;
            },
            decrement() {
                this.myVotingValue--;
            },
        }

    }
</script>