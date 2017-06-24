<template>
    <div >

        <Chat/>
        <NotificationStickyButton :rightOffset="rightOffset"/>


        <ChatStickyButton :rightOffset="this.rightOffset + 50"/>

    </div>
</template>

<script>

    import NotificationStickyButton from 'modules/notifications/NotificationStickyButton.vue';
    import Chat from 'modules/Chat/Chat.vue';
    import ChatStickyButton from 'modules/chat/ChatStickyButton.vue';

    export default{
        name: "StickyButtons",

        data: () => ({
            rightOffset: "0",
        }),

        components: {
            'Chat': Chat,
            'NotificationStickyButton': NotificationStickyButton,
            'ChatStickyButton': ChatStickyButton,
        }


    }
</script>
