<template>
  <div>
    <div id="editor"/>
  </div>
</template>

<script>
import beautify from 'js-beautify'

const DEFAULT_TEXT = `const help = {
  "How to use": "Paste your Javascript here and press Ctrl+Enter to format!",
  "Help": "Check the console for errors if it fails to parse.",
  "Themes": "Toggle dark/light theme with Ctrl+B",
  "Source": "View the source on GitHub at https://github.com/kritzware/json",
  "Info": "Press Ctrl+I at anytime for a reminder of these instructions"
}\n`

const DARK_THEME = 'dracula'

export default {
  data() {
    return {
      darkTheme: true
    }
  },
  async mounted() {
    if (process.browser) {
      const ace = await import('brace')

      /* Plugins */
      require('brace/mode/javascript')
      require(`brace/theme/${DARK_THEME}`)
      require('brace/theme/github')

      const editor = ace.edit('editor')
      editor.getSession().setMode('ace/mode/javascript')
      editor.setTheme(`ace/theme/${DARK_THEME}`)

      editor.setShowPrintMargin(false)

      editor.setOptions({
        fontFamily: 'Roboto Mono',
        fontSize: 15,
        wrap: true,
        tabSize: 2,
        useSoftTabs: true,
        indentedSoftWrap: false
      })

      editor.commands.addCommand({
        name: 'format',
        bindKey: { win: 'Ctrl+Enter', mac: 'Ctrl+Enter' },
        exec: editor => {
          this.format(editor)
        }
      })

      editor.commands.addCommand({
        name: 'toggleTheme',
        bindKey: { win: 'Ctrl+b', mac: 'Ctrl+b' },
        exec: editor => {
          this.toggleTheme(editor)
        }
      })

      editor.commands.addCommand({
        name: 'showHelp',
        bindKey: { win: 'Ctrl+i', mac: 'Ctrl+i' },
        exec: editor => {
          this.showHelp(editor)
        }
      })

      editor.commands.bindKeys({ 'ctrl-l': null })
      editor.commands.removeCommands(['gotoline', 'find'])

      const { d } = this.$route.query
      let decoded = null

      if (d) {
        decoded = atob(d)
      }

      const cached = localStorage.getItem('jscache')
      if (cached) {
        editor.setValue(cached)
      } else {
        editor.setValue(decoded || DEFAULT_TEXT)
      }

      editor.clearSelection()
      if (decoded) {
        editor.gotoLine(1)
        editor.scrollToLine(1, 1, true)
      }
      editor.focus()
      editor.gotoLine(1)
      editor.scrollToLine(1, 1, true)
    }
  },
  methods: {
    format(editor) {
      const text = editor.getValue()

      if (!text) {
        return
      }

      try {
        const formatted = beautify(text, {
          indent_size: 2,
          end_with_newline: true,
          break_chained_methods: true
        })
        editor.setValue(formatted)
        editor.gotoLine(1)
        editor.scrollToLine(1, 1, true)
        this.saveJS(formatted)
      } catch (err) {
        console.error('Error formating JS')
        console.error(err)
      }
    },
    saveJS(text) {
      localStorage.setItem('jscache', text)
    },
    toggleTheme(editor) {
      if (this.darkTheme) {
        editor.setTheme('ace/theme/github')
        this.darkTheme = false
      } else {
        editor.setTheme(`ace/theme/${DARK_THEME}`)
        this.darkTheme = true
      }
    },
    showHelp(editor) {
      alert(DEFAULT_TEXT)
    }
  }
}
</script>

<style>
#editor {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
