<template>

    <div class="vote-actions">
        <i class="fa fa-chevron-up vote-font-icon" @click="voteUp" :style="{color: this.votedUp ? 'deepskyblue' : ''}"> </i>

            <div v-if="((typeof voting === 'undefined')||(voting.loading === true))">
                <i class="fa fa-spinner fa-spin" > </i>
            </div>
            <div v-else-if="(voting.value) >= 0" >
                {{voting.value}}
            </div>
            <div v-else>
                <strong> - </strong>
            </div>

        <i class="fa fa-chevron-down vote-font-icon" @click="voteDown" :style="{color: this.votedDown ? 'deepskyblue' : ''}"> </i>
    </div>
</template>

<script>

    import Voting from 'models/Vote/Voting.model'
    import VoteType from 'models/Vote/VoteType';

    export default {

        name: 'Voting',

        props: {
            parentId : { default: '' }
        },

        computed:{

            voting(){
                return this.$store.state.content.contentVotes.votes[this.parentId];
            },

            authenticatedUserId(){
                return this.$store.state.authenticatedUser.user.id;
            },

            votedUp(){

                let voting = this.voting;
                let userId = this.authenticatedUserId;

                if ((voting !== null)&&(typeof voting !== 'undefined')&&(voting.votes !== null))
                    for (let i = 0; i < voting.votes.length; i++)
                        if (voting.votes[i].userId === userId)
                            return voting.votes[i].voteType === VoteType.VOTE_UP;


                return false;
            },

            votedDown(){

                let voting = this.voting;
                let userId = this.authenticatedUserId;

                if ((voting !== null)&&(typeof voting !== 'undefined')&&(voting.votes !== null))
                for (let i=0; i<voting.votes.length; i++)
                    if (voting.votes[i].userId === userId)
                        return voting.votes[i].voteType === VoteType.VOTE_DOWN;


                return false;
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
            voteUp() {
                this.$store.dispatch('CONTENT_VOTES_SUBMIT_VOTE', {parentId: this.parentId, userId: this.$store.state.authenticatedUser.user.id, voteType: VoteType.VOTE_UP});
            },
            voteDown() {
                this.$store.dispatch('CONTENT_VOTES_SUBMIT_VOTE', {parentId: this.parentId, userId: this.$store.state.authenticatedUser.user.id, voteType: VoteType.VOTE_DOWN});
            },
        }

    }
</script>