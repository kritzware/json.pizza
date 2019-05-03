<template>
  <div>
    <div id="editor"/>
  </div>
</template>

<script>
const DEFAULT_TEXT = `{
  "How to use": "Paste your JSON here and press Ctrl+Enter to format!",
  "Help": "Check the console for errors if it fails to parse.",
  "Themes": "Toggle dark/light theme with Ctrl+B",
  "Share": "Print a shareable URL to the console with Ctrl+L",
  "Source": "View the source on GitHub at https://github.com/kritzware/json",
  "Info": "Press Ctrl+I at anytime for a reminder of these instructions"
}\n`

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
      require('brace/mode/json')
      require('brace/theme/vibrant_ink')
      require('brace/theme/github')

      const editor = ace.edit('editor')
      editor.getSession().setMode('ace/mode/json')
      editor.setTheme('ace/theme/vibrant_ink')

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
        name: 'getShareableLink',
        bindKey: { win: 'Ctrl+l', mac: 'Ctrl+l' },
        exec: editor => {
          this.getShareableLink(editor)
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

      const cached = localStorage.getItem('jsoncache')
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
    }
  },
  methods: {
    format(editor) {
      const text = editor.getValue()

      if (!text) {
        return
      }

      try {
        const formattedText = JSON.stringify(JSON.parse(text), null, 2)
        editor.setValue(formattedText)
        editor.gotoLine(1)
        editor.scrollToLine(1, 1, true)
        // editor.setReadOnly(true)
        this.saveJSON(formattedText)
      } catch (err) {
        console.error('Error formatting JSON')
        console.error(err)
      }
    },
    saveJSON(text) {
      localStorage.setItem('jsoncache', text)
    },
    toggleTheme(editor) {
      if (this.darkTheme) {
        editor.setTheme('ace/theme/github')
        this.darkTheme = false
      } else {
        editor.setTheme('ace/theme/vibrant_ink')
        this.darkTheme = true
      }
    },
    getShareableLink(editor) {
      const text = editor.getValue()

      if (!text) {
        return
      }

      const blob = btoa(text)
      const url = `${window.location.href}?d=${blob}`
      console.log(url)
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
