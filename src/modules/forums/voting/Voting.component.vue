
<template>

    <div class="vote-actions">
            <i class="fa fa-chevron-up"  v-on:click="increment"> </i>
        <div> {{myVotingValue}}</div>
            <i class="fa fa-chevron-down"  v-on:click="decrement"> </i>
    </div>
</template>


<script>

    import Votes from 'models/Votes/Votes.model'

    export default {

        name: 'Voting',

        components: {
            "Voting":  this,
            "Votes": Votes
        },

        props:{
            voteId :{default:null}
        },

        data: function () {
            this.votes  = new Votes( {
                id :55544, value:1, parentId:5,topicId : 244, votings : 677801931,
            });
            return {

                myVotingValue :this.votes.value,
            }
        },

        mounted: function (){


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