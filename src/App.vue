<template>
  <div class="container" :style="{ 'background-color': isDarkTheme ? 'black' : '#efeff1' }">
    <div class="sidebar">
      <router-link to="/" style="text-decoration:none;">
        <div class="icon">🍕</div>
      </router-link>
      <div>
        <div @click="toggleTheme">
          <div class="icon-theme">
            <div v-if="isDarkTheme">🌞</div>
            <div v-else>🌚</div>
          </div>
        </div>
        <img
          src="/icons/i.png"
          style="width:24px;cursor:pointer;margin-left:1px;"
          @click="toggleInfoBox"
        />
      </div>
      <transition name="fade">
        <InfoBox v-if="!loading && !showInfo.completed" />
      </transition>
    </div>
    <router-view :theme="theme"></router-view>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { useTheme } from "./composables/theme";

import InfoBox from "./components/InfoBox.vue";
import { useLocalStorage, StorageKey } from "./composables/localStorage";

export default {
  name: "App",
  components: {
    InfoBox
  },
  setup() {
    const loading = ref(true);

    const showInfo = useLocalStorage(StorageKey.ONBOADING1, {
      completed: false
    });
    const { theme, isDarkTheme, toggleTheme } = useTheme();

    const toggleInfoBox = () => {
      showInfo.value = { completed: !showInfo.value.completed };
    };

    onMounted(() => {
      showInfo.value = JSON.parse(showInfo.value);
      loading.value = false;
    });

    return {
      loading,
      theme,
      isDarkTheme,
      toggleTheme,
      showInfo,
      toggleInfoBox
    };
  }
};
</script>

<style>
/* html,
body {
  height: 100%;
  margin: 0;
} */

html {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
  font-size: 16px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.icon {
  font-size: 30px;
  padding-left: 2px;
  cursor: pointer;
  user-select: none;
}
.icon-theme {
  font-size: 26px;
  vertical-align: middle;
  line-height: 1;
  margin-bottom: 24px;
  cursor: pointer;
  user-select: none;
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
/* Button Feedback */
.copied {
  position: relative;
  overflow: hidden;
}
.copied:after {
  content: "";
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
</style>
