<template>
  <div class="container">
    <div class="sidebar">
      <div class="icon">🍕</div>
      <svg :class="{ 'active': info }" class="info-icon" width="25" height="25" xmlns="http://www.w3.org/2000/svg" @click="info = !info"><path d="M12.5 0C19.3927083 0 25 5.607292 25 12.5S19.3927083 25 12.5 25 0 19.392708 0 12.5 5.6072917 0 12.5 0zm0 2C6.710125 2 2 6.710125 2 12.5S6.710125 23 12.5 23 23 18.289875 23 12.5 18.289875 2 12.5 2zm2.158 16.284c-.661.26-2.952 1.354-4.272.191-.394-.346-.59-.785-.59-1.318 0-.998.328-1.868.919-3.957.104-.395.231-.907.231-1.313 0-.701-.266-.887-.987-.887-.352 0-.742.125-1.095.257l.195-.799c.787-.32 1.775-.71 2.621-.71 1.269 0 2.203.633 2.203 1.837 0 .347-.06.955-.186 1.375l-.73 2.582c-.151.522-.424 1.673-.001 2.014.416.337 1.401.158 1.887-.071l-.195.799zM13.452 8c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5z" fill="#FFF" fill-rule="nonzero"/></svg>
      <transition name="fade">
        <div v-if="info" class="info-box">
          <b>How to use:</b> Paste your JSON in the editor and press <b>Format</b> (Ctrl+Enter).<br>
          <b>Share:</b> To copy a shareable URL to your clipboard, click <b>Share</b> (Ctrl+L).<br>
          <b>Errors:</b> Check the console for errors if your JSON fails to parse.<br>
          <b>Themes:</b> Toggle between dark/light themes by pressing Ctrl+B.<br>
          <b>Privacy:</b> Your data will not be stored or shared with any third parties.<br>
          <b>Source:</b> View the source code on <a href="https://github.com/kritzware/json" target="_blank" rel="noopener">GitHub.</a>
        </div>
      </transition>
    </div>
    <div class="editor">
      <div id="editor"/>
    </div>
    <div class="action-buttons">
      <button>
        <svg style="margin-right: 10px;" width="16" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h16v2H0V0zm0 12h16v2H0v-2zm0-4h6v2H0V8zm0-4h6v2H0V4zm12 2V3l4 4-4 4V8H8V6h4z" fill="#FFF" fill-rule="nonzero"/></svg>
        Format
      </button>
      <button>
        <svg style="margin-right: 10px;" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M15 5c.6 0 1 .4 1 1v9c0 .6-.4 1-1 1H8c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1h7zM5 4v10H1c-.6 0-1-.4-1-1V1c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v2H6c-.6 0-1 .4-1 1z" fill="#FFF" fill-rule="nonzero"/></svg>
        Copy
      </button>
      <button>
        <svg style="margin-right: 10px;" width="16" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M8 4C2.8 4 0 7.8 0 14c1.5-2.4 2.7-4 8-4v4l8-7-8-7v4z" fill="#FFF" fill-rule="nonzero"/></svg>
        Share
      </button>
    </div>
  </div>
</template>

<script>
const DEFAULT_TEXT = `{
  "How to use": "Paste your JSON in the editor and press Format (Ctrl+Enter).",
  "Share": "To copy a shareable URL to your clipboard, click Share (Ctrl+L).",
  "Errors": "Check the console for errors if your JSON fails to parse.",
  "Themes": "Toggle between dark/light theme by pressing Ctrl+B",
  "Privacy": "Your data will not be stored or shared with any third parties.",
  "Source": "View the source code on GitHub at https://github.com/kritzware/json"
}`

export default {
  data() {
    return {
      darkTheme: true,
      info: false
    }
  },
  async mounted() {
    if (process.browser) {
      const ace = await import('brace')

      // Plugins

      require('brace/mode/json')
      require('brace/theme/vibrant_ink')
      require('brace/theme/github')

      // Editor config

      const editor = ace.edit('editor')
      editor.getSession().setMode('ace/mode/json')
      editor.setTheme('ace/theme/vibrant_ink')

      editor.setShowPrintMargin(false)

      editor.setOptions({
        fontFamily: 'Roboto Mono',
        fontSize: 14,
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
html {
  background-color: #000;
}
.icon {
  font-size: 30px;
  padding-left: 2px;
  cursor: pointer;
  user-select: none;
}
.info-icon {
  opacity: 0.3;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  user-select: none;
}
.info-icon:hover,
.info-icon.active {
  opacity: 1;
}
.info-box {
  position: fixed;
  bottom: 60px;
  left: 64px;
  width: auto;
  height: auto;
  background-color: #333;
  color: white;
  z-index: 99999;
  border-radius: 6px;
  padding: 24px 28px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
  font-size: 14px;
  line-height: 2;
}
.info-box a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
}
.info-box a:hover {
  color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.8);
}
.container {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
}
.sidebar {
  width: 80px;
  flex: 0 0 80px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 28px 24px;
}
.editor {
  height: 100vh;
  width: 100%;
  padding: 24px 24px 24px 2px;
}
#editor {
  height: 100%;
  width: 100%;
  border-radius: 6px;
}
.action-buttons {
  position: fixed;
  right: 46px;
  bottom: 46px;
  color: white;
  z-index: 999;
  display: flex;
  align-items: center;
}
button {
  display: inline-flex;
  align-items: center;
  border: none;
  outline: none;
  padding: 12px 20px 12px 20px;
  height: 47px;
  text-decoration: none;
  background-color: #232323;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
  font-weight: 600;
  letter-spacing: 0.2px;
  font-size: 12px;
  text-transform: uppercase;
  cursor: pointer;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  -webkit-appearance: none;
  -moz-appearance: none;
  border-radius: 6px;
  user-select: none;
}
button:hover {
  background-color: #323232;
}
button:active {
  transform: translateY(1px);
}
.action-buttons button {
  margin-left: 8px;
}

/*Transitions*/
.fade-enter-active {
  animation: fade-in 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.fade-leave-active {
  animation: fade-in 0.2s cubic-bezier(0.19, 1, 0.22, 1) reverse;
}
@keyframes fade-in {
  0% {
    transform: translateY(16px);
    opacity: 0;
  }
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}
</style>
