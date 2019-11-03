<template>
  <div class="container">
    <div class="sidebar">
      <div class="icon">🍕</div>
      <div>
        <div @click="toggleTheme(editor)">
          <div
            style="font-size:26px;vertical-align:middle;line-height:1;margin-bottom:24px;cursor:pointer;user-select:none;"
          >
            <div v-if="darkTheme">🌞</div>
            <div v-else>🌚</div>
          </div>
        </div>
        <img src="/i.png" style="width:24px;cursor:pointer;margin-left:1px;" @click="toggleInfoBox" />
      </div>
      <transition name="fade">
        <div v-click-outside="hideInfoBox" v-if="info" class="info-box">
          <b>How to use:</b> Paste your JSON in the editor and press
          <b>Format</b> (Ctrl+Enter).
          <br />
          <!-- <b>Share:</b> To copy a shareable URL to your clipboard, click <b>Share</b> (Ctrl+L).<br> -->
          <b>Errors:</b> Check the console for errors if your JSON fails to parse.
          <br />
          <b>Themes:</b> Toggle between dark/light themes by pressing Ctrl+B.
          <br />
          <b>Privacy:</b> Your data will not be stored or shared with any third parties.
          <br />
          <b>Source:</b> View the source code on
          <a
            href="https://github.com/kritzware/json"
            target="_blank"
            rel="noopener"
          >GitHub.</a>
        </div>
      </transition>
    </div>
    <div class="editor">
      <div id="editor" />
    </div>
    <div class="action-buttons">
      <p v-if="format_time && formatted" :style="{color:format_time_color}">{{ format_time }}</p>
      <button :class="{ 'formatted' : formatted === true }" @click="format(editor)">
        <svg style="margin-right: 10px;" width="16" height="14" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 0h16v2H0V0zm0 12h16v2H0v-2zm0-4h6v2H0V8zm0-4h6v2H0V4zm12 2V3l4 4-4 4V8H8V6h4z"
            fill="#FFF"
            fill-rule="nonzero"
          />
        </svg>
        Format
        <transition name="check-fade">
          <div v-show="formatted" class="formatted-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <path d="M6.61 11.89L3.5 8.78 2.44 9.84 6.61 14l8.95-8.95L14.5 4z" fill="#fff" />
            </svg>
          </div>
        </transition>
      </button>
      <button :class="{ 'copied' : copied === true }" @click="copy">
        <svg style="margin-right: 10px;" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15 5c.6 0 1 .4 1 1v9c0 .6-.4 1-1 1H8c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1h7zM5 4v10H1c-.6 0-1-.4-1-1V1c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v2H6c-.6 0-1 .4-1 1z"
            fill="#FFF"
            fill-rule="nonzero"
          />
        </svg>
        Copy
        <transition name="check-fade">
          <div v-show="copied" class="copied-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <path d="M6.61 11.89L3.5 8.78 2.44 9.84 6.61 14l8.95-8.95L14.5 4z" fill="#fff" />
            </svg>
          </div>
        </transition>
      </button>
      <!-- <button>
        <svg style="margin-right: 10px;" width="16" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M8 4C2.8 4 0 7.8 0 14c1.5-2.4 2.7-4 8-4v4l8-7-8-7v4z" fill="#FFF" fill-rule="nonzero"/></svg>
        Share
      </button>-->
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

Vue.directive('click-outside', {
  bind: function(el, binding, vnode) {
    el.clickOutsideEvent = function(event) {
      if (!(el == event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
})

const DEFAULT_TEXT = `{
  "How to use": "Paste your JSON in the editor and press Format (Ctrl+Enter).",
  "Errors": "Check the console for errors if your JSON fails to parse.",
  "Themes": "Toggle between dark/light theme by pressing Ctrl+B",
  "Privacy": "Your data will not be stored or shared with any third parties.",
  "Source": "View the source code on GitHub at https://github.com/kritzware/json"
}`

export default {
  data() {
    return {
      darkTheme: true,
      info: false,
      editor: null,
      copied: false,
      formatted: false,
      format_time: 0,
      format_time_color: '#5ce60b'
    }
  },
  async mounted() {
    if (process.browser) {
      const seenInfo = localStorage.getItem('jsonpizza:seen-info')
      if (!seenInfo) {
        this.info = true
      }

      const ace = await import('brace')

      // Plugins

      require('brace/mode/json')
      require('brace/theme/vibrant_ink')
      require('brace/theme/github')

      // Editor config
      this.editor = ace.edit('editor')
      this.editor.getSession().setMode('ace/mode/json')
      this.editor.setTheme('ace/theme/vibrant_ink')

      this.editor.setShowPrintMargin(false)
      this.editor.container.style.lineHeight = 1.5

      this.editor.setOptions({
        fontFamily: 'Roboto Mono',
        fontSize: 14,
        wrap: true,
        tabSize: 2,
        useSoftTabs: true,
        indentedSoftWrap: false
      })

      this.editor.commands.addCommand({
        name: 'format',
        bindKey: { win: 'Ctrl+Enter', mac: 'Ctrl+Enter' },
        exec: editor => {
          this.format(editor)
        }
      })

      this.editor.commands.addCommand({
        name: 'toggleTheme',
        bindKey: { win: 'Ctrl+b', mac: 'Ctrl+b' },
        exec: editor => {
          this.toggleTheme(editor)
        }
      })

      this.editor.commands.addCommand({
        name: 'getShareableLink',
        bindKey: { win: 'Ctrl+l', mac: 'Ctrl+l' },
        exec: editor => {
          this.getShareableLink(editor)
        }
      })

      this.editor.commands.addCommand({
        name: 'showHelp',
        bindKey: { win: 'Ctrl+i', mac: 'Ctrl+i' },
        exec: editor => {
          this.showHelp(editor)
        }
      })

      this.editor.commands.bindKeys({ 'ctrl-l': null })
      this.editor.commands.removeCommands(['gotoline', 'find'])

      const { d } = this.$route.query
      let decoded = null

      if (d) {
        decoded = atob(d)
      }

      const cached = localStorage.getItem('jsoncache')
      if (cached) {
        this.editor.setValue(cached)
      } else {
        this.editor.setValue(decoded || DEFAULT_TEXT)
      }

      this.editor.clearSelection()
      this.editor.gotoLine(1)
      this.editor.scrollToLine(1, 1, true)
      this.editor.focus()
    }
  },
  methods: {
    format(editor) {
      this.hideInfoBox()
      const text = editor.getValue()

      if (!text) {
        return
      }

      const t0 = performance.now()

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

      const t1 = performance.now()
      const time = t1 - t0
      console.log(time)
      this.format_time =
        time <= 1000 ? `${time.toFixed(0)}ms` : `${(time / 1000).toFixed(1)}s`
      this.format_time_color =
        time < 1500 ? '#5ce60b' : time < 4000 ? '#ffcd00' : '#c83c1f'

      this.formatted = true
      setTimeout(() => {
        this.formatted = false
      }, time < 5000 ? 1250 : 3000)
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
    },
    copy() {
      this.editor.selectAll()
      this.editor.focus()
      document.execCommand('copy')
      this.editor.clearSelection()
      this.editor.gotoLine(1)
      this.editor.scrollToLine(1, 1, true)
      this.copied = true
      setTimeout(() => {
        this.copied = false
      }, 1250)
    },
    hideInfoBox() {
      if (!this.info) return
      this.info = false
      localStorage.setItem('jsonpizza:seen-info', 1)
    },
    toggleInfoBox() {
      this.info = !this.info
      if (!localStorage.getItem('jsonpizza:seen-info')) {
        localStorage.setItem('jsonpizza:seen-info', 1)
      }
    }
  },
  head() {
    return {
      bodyAttrs: {
        style: this.darkTheme
          ? 'background-color: black'
          : 'background-color: #efeff1'
      }
    }
  }
}
</script>

<style>
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
  bottom: 46px;
  left: 64px;
  width: auto;
  height: auto;
  background-color: #171718;
  color: white;
  z-index: 99999;
  border-radius: 6px;
  padding: 24px 28px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
  font-size: 14px;
  line-height: 2;
  box-shadow: 0 16px 40px -4px rgba(0, 0, 5, 0.4);
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
  background-color: #171718;
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
  position: relative;
}
button:hover {
  background-color: #212122;
}
button:active {
  transform: translateY(1px);
}
.action-buttons button {
  margin-left: 8px;
}

/* Button Feedback */
.copied {
  position: relative;
  overflow: hidden;
}
.copied:after {
  content: '';
  background-color: #009252 !important;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  overflow: hidden;
}
.copied-check {
  position: absolute;
  left: 0;
  right: 0;
  top: 14px;
  z-index: 999;
}

.formatted {
  position: relative;
  overflow: hidden;
}
.formatted:after {
  content: '';
  background-color: #009252 !important;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  overflow: hidden;
}
.formatted-check {
  position: absolute;
  left: 0;
  right: 0;
  top: 14px;
  z-index: 999;
}

.dark-fill path {
  fill: #171718;
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

.check-fade-enter-active {
  animation: check-fade-in 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.check-fade-leave-active {
  animation: check-fade-out 0s cubic-bezier(0.19, 1, 0.22, 1);
}
@keyframes check-fade-in {
  0% {
    transform: translateY(16px);
    opacity: 0;
  }
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}
@keyframes check-fade-out {
  0% {
    transform: translateY(0px);
    opacity: 1;
  }
  100% {
    transform: translateY(0px);
    opacity: 0;
  }
}
</style>
