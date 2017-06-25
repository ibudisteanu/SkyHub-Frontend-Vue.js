/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on ${DATE}.
 * (C) BIT TECHNOLOGIES
 */

<template>
    <div v-show="displayStatusBar">
        <nav class='navbar navbar-default' :style="{display: 'inline-block', width: '100%', marginBottom: '10px', minHeight: '26px', background: getStatusBarBackgroundColor }" >

            <div :style="{textAlign: 'center', margiTop: 5, color: getStatusBarTextColor}">
                <i :class="socketStatus.icon" aria-hidden="true"></i>
                <b :style="{color: getStatusBarTextColor}">{{ socketStatus.message }}</b>
            </div>

        </nav>
    </div>
</template>

    
<script>
    export default{
        name: 'HeaderBarSocketStatus',

        computed: {

            socketStatus(){
                return this.$store.state.socketStatus;
            },

            displayStatusBar(){
                return this.socketStatus.connectionOffline || this.socketStatus.showOnlineStatus;
            },

            getStatusBarBackgroundColor(){
                if (this.socketStatus.connectionOffline)
                    return 'red';
                else
                if (this.socketStatus.showOnlineStatus)
                    return 'yellow';
            },

            getStatusBarTextColor(){
                if (this.socketStatus.connectionOffline)
                    return 'yellow';
                else
                if (this.socketStatus.showOnlineStatus)
                    return 'navy';
            }

        }

    }
</script>
