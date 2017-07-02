<template>

    <div class="vote-actions">
        <i class="fa fa-thumbs-o-up vote-font-icon cursor" @click="voteUp" :style="{color: this.votedUp ? 'deepskyblue' : ''}"> </i>

            <div v-if="((typeof voting === 'undefined')||(voting.loading === true))">
                <i class="fa fa-spinner fa-spin" > </i>
            </div>
            <div class="cursor" v-else-if="(voting.value) >= 0" @click="showAllVotes" v-popover:right="{title:'', html:true, content:this.getVotesListContent}" >
                {{voting.value}}
            </div>
            <div class="cursor" v-else>
                <strong> - </strong>
            </div>

        <i class="fa fa-thumbs-o-down vote-font-icon cursor" @click="voteDown" :style="{color: this.votedDown ? 'red' : ''}"> </i>
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

            getVotesListContent(){

                console.log('getVotesListContent', this.voting.votesAllLoaded, 'showVotesAllLoading', this.showVotesAllLoading);
                if (!this.showVotesAllLoading) return '';

                if (!this.voting.votesAllLoaded)
                    return '<i class=\'fa fa-spinner fa-spin\' > </i>';
                else {

                    let sHTML = '';
                    console.log(this.voting.votes);
                    for (let i=0; i<this.voting.votes.length; i++)
                        if ((this.voting.votes[i].voteType === VoteType.VOTE_UP)||(this.voting.votes[i].voteType === VoteType.VOTE_DOWN))
                        {
                            sHTML+=`
                                <div>
                                     <span>${this.voting.votes[i].userId}</span>
                                     <i class="fa ${this.voting.votes[i].voteType === VoteType.VOTE_UP ? 'fa-thumbs-o-up' : 'fa-thumbs-o-down'}"> </i>
                                </div>
                                `;
                        }

                    return sHTML;
                }
            },

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
                showVotesAllLoading: false,
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
            showAllVotes(){
                this.showVotesAllLoading=true;
                this.$store.dispatch('CONTENT_VOTES_FETCH_ALL_VOTES', {parentId: this.parentId});
            },
        }

    }
</script>