<template>
  <div class="info-box">
    <b>How to use:</b> Paste your JSON in the editor and press
    <b>Format</b>
    ({{ modifier }}+Enter).
    <br />
    <b>Themes:</b>
    Toggle between dark/light themes by pressing {{ modifier }}+B.
    <br />
    <!-- <b>Privacy:</b> Your data will not be stored or shared with any third parties. -->
    <b>Privacy:</b> All data is stored locally and not shared with any third parties.
    <br />
    <b>Source:</b> View the source code on
    <a
      href="https://github.com/kritzware/json"
      target="_blank"
      rel="noopener"
    >GitHub.</a>
    <br />
    <b>Support:</b> If you enjoy using json.pizza,
    <a
      href="https://buymeacoffee.com/kritzware"
      target="_blank"
      rel="noopener"
    >consider supporting us.</a>
  </div>
</template>

<script>
export default {
  setup() {
    return {
      modifier: "Cmd"
    };
  }
};
</script>

<style>
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
</style>