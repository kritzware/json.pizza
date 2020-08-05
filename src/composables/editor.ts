import { ref, reactive, onMounted, toRef, Ref, watch } from "vue";
import * as monaco from "monaco-editor";
import { Theme } from "@/composables/theme";

interface EditorState {
  editor: monaco.editor.IStandaloneCodeEditor;
  theme: Theme;
}

export enum Command {
  TOGGLE_THEME = "command-toggle-theme",
  FORMAT = "command-format",
}

// Default Editor settings
const DEFAULT_SETTINGS: monaco.editor.IStandaloneEditorConstructionOptions = {
  // theme: "vs-dark",
  language: "json",
  fontFamily: "Roboto Mono",
  fontSize: 14,
  tabSize: 2,
  scrollBeyondLastLine: false,
  glyphMargin: false,
  minimap: {
    enabled: false,
  },
  automaticLayout: true,
  wordWrap: "on",
  scrollbar: {
    // Subtle shadows to the left & top. Defaults to true.
    useShadows: true,
    // Render vertical arrows. Defaults to false.
    verticalHasArrows: false,
    // Render horizontal arrows. Defaults to false.
    horizontalHasArrows: true,
    // Render vertical scrollbar.
    // Accepted values: 'auto', 'visible', 'hidden'.
    // Defaults to 'auto'
    vertical: "visible",
    // Render horizontal scrollbar.
    // Accepted values: 'auto', 'visible', 'hidden'.
    // Defaults to 'auto'
    horizontal: "visible",
    verticalScrollbarSize: 17,
    horizontalScrollbarSize: 17,
    arrowSize: 30,
  },
};

// Dark theme
monaco.editor.defineTheme(Theme.DARK, {
  base: "vs-dark",
  inherit: true,
  rules: [{ token: "", background: "0C0C0C" }],
  colors: {
    "editor.background": "#0C0C0C",
    // "editor.foreground": "#FF0000",
    // "editor.selectionBackground": "#0C0C0C",
    "editor.lineHighlightBackground": "#333333",
  },
});

// Light theme
monaco.editor.defineTheme(Theme.LIGHT, {
  base: "vs",
  inherit: true,
  rules: [{ token: "", background: "FFFFFF" }],
  colors: {
    "editor.background": "#FFFFFF",
    // "editor.foreground": "#FF0000",
    // "editor.selectionBackground": "#0C0C0C",
    // "editor.lineHighlightBackground": "#0F0F0F",
  },
});

export function useEditor(el: string, content: string, theme: Ref<Theme>) {
  // let state = reactive<EditorState>({
  //   // @ts-ignore Editor declared when component is mounted
  //   editor: undefined,
  // });
  let editor: monaco.editor.IStandaloneCodeEditor;

  const formatDocument = async () => {
    await editor.getAction("editor.action.formatDocument").run();
    const newContent = editor.getValue();
    return newContent;
  };

  const addCommand = (keys: number, action: () => void) => {
    editor.addCommand(keys, action);
  };

  const changeTheme = (theme: Theme) => {
    monaco.editor.setTheme(theme);
  };

  watch(theme, () => {
    changeTheme(theme.value);
  });

  onMounted(() => {
    editor = newEditor(el, content, theme.value);

    // Remove Cmd+L shortcut as it conflicts with browser shortcut
    // state.editor._standaloneKeybindingService.addDynamicKeybinding(
    //   "-expandLineSelection"
    // );
  });

  return {
    // state,
    formatDocument,
    addCommand,
    changeTheme,
  };
}

export function useDiffEditor() {
  onMounted(() => {
    const originalModel = monaco.editor.createModel(
      "This line is removed on the right.\njust some text\nabcd\nefgh\nSome more text",
      "text/plain"
    );
    const modifiedModel = monaco.editor.createModel(
      "just some text\nabcz\nzzzzefgh\nSome more text.\nThis line is removed on the left.",
      "text/plain"
    );

    const diffEditor = monaco.editor.createDiffEditor(
      document.getElementById("diff-container"),
      {
        // You can optionally disable the resizing
        enableSplitViewResizing: false,
        originalEditable: true,
        readOnly: false,
      }
    );
    diffEditor.setModel({
      original: originalModel,
      modified: modifiedModel,
    });
  });
}

function newEditor(el: string, value: string, theme: Theme) {
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
  });
  const element = document.getElementById(el);
  if (!element) {
    throw new Error(`Failed to find editor element #${el}`);
  }
  const mainEditor = monaco.editor.create(element, {
    value,
    theme,
    ...DEFAULT_SETTINGS,
  });

  // const model = mainEditor.getModel();

  // const secondEditor = monaco.editor.create(
  //   document.getElementById("editor-container2")!,
  //   {
  //     ...DEFAULT_SETTINGS,
  //     value,
  //     readOnly: false,
  //     lineNumbers: "off",
  //     glyphMargin: false,
  //     folding: false,
  //     // Undocumented see https://github.com/Microsoft/vscode/issues/30795#issuecomment-410998882
  //     // lineDecorationsWidth: 0,
  //     // lineNumbersMinChars: 0,
  //   }
  // );

  // const diffEditor = monaco.editor.createDiffEditor(
  //   document.getElementById("diff-container"),
  //   {
  //     ...DEFAULT_SETTINGS,
  //     // You can optionally disable the resizing
  //     enableSplitViewResizing: false,
  //     originalEditable: true,
  //     readOnly: false,
  //   }
  // );
  // diffEditor.setModel({
  //   original: model,
  //   modified: secondEditor.getModel(),
  // });

  return mainEditor;
}
