<template>
  <div class="format-container">
    <div class="editor">
      <Editor ref="editor" :content="content" :theme="theme" @cmd-format="format" />
    </div>
    <div class="action-buttons">
      <Button icon="format" @clicked="format">Format</Button>
      <Button icon="save" @clicked="save" />
    </div>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line
import { ref, Ref, onMounted } from "vue";
// eslint-disable-next-line
import Editor, { EditorState } from "@/components/Editor.vue";
import Button from "@/components/Button.vue";
// import Modal from "@/components/Modal.vue";
import { useLocalStorage, StorageKey } from "@/composables/localStorage";
import router from "@/router";
// import { useQueryParams } from "@/composables/params";

export default {
  components: {
    Editor,
    Button
    // Modal
  },
  props: {
    theme: {
      type: String,
      required: true
    }
  },
  setup() {
    // @ts-ignore HTML ref is defined once mounted
    const editor: Ref<EditorState> = ref(null);

    const content = useLocalStorage(
      StorageKey.FORMAT,
      JSON.stringify(
        [
          {
            name: "Margherita",
            base: "tomato",
            toppings: ["mozzarella", "basil", "olive oil"],
            quantity: 5,
            cooked: false
          }
        ],
        null,
        2
      )
    );

    const format = async () => {
      const newContent = await editor.value.formatDocument();
      content.value = newContent;
    };

    const save = () => {
      console.log("save data");
    };

    onMounted(async () => {
      if (router.currentRoute.value?.query?.af) {
        await format();
      }
    });

    return {
      editor,
      format,
      save,
      content
    };
  }
};
</script>

<style scoped>
.format-container {
  width: 100%;
}
.editor {
  height: 100vh;
  width: 100%;
  padding: 24px 24px 24px 2px;
}
.action-buttons {
  position: fixed;
  right: 66px;
  bottom: 46px;
  color: white;
  z-index: 999;
  display: flex;
  align-items: center;
}
.action-buttons button {
  margin-left: 8px;
}
</style>