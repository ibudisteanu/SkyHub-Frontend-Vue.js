<template>

    <div class="vote-actions">
        <i class="fa fa-chevron-up" v-on:click="increment"> </i>
        <div v-if="typeof voting === 'undefined'">
            <i class="fa fa-spinner fa-spin" > </i>
        </div>
        <div v-else-if="(voting.value || 0) >= 0">
            {{voting.value || 0}}
        </div>
        <div v-else>
            <strong> - </strong>
        </div>
        <i class="fa fa-chevron-down" v-on:click="decrement"> </i>
    </div>
</template>

<script>

    import Voting from 'models/Vote/Voting.model'

    export default {

        name: 'Voting',

        props: {
            parentId : { default: '' }
        },

        computed:{

            voting(){

                return this.$store.state.content.contentVotes.votes[this.parentId];

            }

        },

        data: function () {
            return {

            }
        },

        mounted: function () {

            this.$store.dispatch('CONTENT_VOTES_FETCH', {parentId: this.parentId})

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