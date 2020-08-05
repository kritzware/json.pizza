<template>
  <!-- <div class="float-container">
    <div id="diff-container" style="height:100%;" />
    <div class="float-child">
      <div id="editor-container"></div>
    </div>
    <div class="float-child">
      <div id="editor-container2"></div>
    </div>
  </div>-->
  <!-- <div class="float-container">
    <div class="float-child">
      <div id="editor-container"></div>
    </div>
  </div>-->
  <div id="editor-container"></div>
</template>

<script lang="ts">
import { toRefs, onMounted } from "vue";
import * as monaco from "monaco-editor";
import { useEditor } from "@/composables/editor";
import { Theme } from "@/composables/theme";

interface EditorProps {
  content: string;
  theme: Theme;
}

export interface EditorState extends EditorProps {
  formatDocument: () => Promise<string>;
}

export default {
  props: {
    content: {
      type: String,
      required: true
    },
    theme: {
      type: String,
      required: true,
      default: Theme.DARK
    }
  },
  setup(props: EditorProps, { emit }) {
    const { content, theme } = toRefs(props);

    const { formatDocument, addCommand } = useEditor(
      "editor-container",
      content.value,
      theme
    );

    onMounted(() => {
      // -- Commands --
      // Cmd+Enter -> format
      addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () =>
        emit("cmd-format")
      );
    });

    return {
      formatDocument
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#editor-container {
  height: 100%;
  width: 100%;
}
.float-container {
  height: 100%;
}
.float-child {
  width: 100%;
  float: left;
  height: 100%;
}
</style>
