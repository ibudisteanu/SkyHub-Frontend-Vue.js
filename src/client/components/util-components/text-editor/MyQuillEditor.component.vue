
<template>

    <AdvancedQuillEditor @onChange = "quillEditorChange" >

    </AdvancedQuillEditor>

</template>

<script>

    if (typeof window === 'undefined') //SSR
    {
        var AdvancedQuillEditor = require('client/components/util-components/UI/EmptyComponent.component.vue');
    } else {
        var AdvancedQuillEditor = require ('./advanced-quill-editor/AdvancedQuillEditor.component.vue');
    }

    export default{

        components: {
            'AdvancedQuillEditor': AdvancedQuillEditor,
        },

        methods:{
            quillEditorChange(editor, content, text){
                this.$emit('onChange', editor, content, text);
            }
        }

    }

</script>