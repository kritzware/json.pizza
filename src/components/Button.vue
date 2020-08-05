<template>
  <button :class="{ 'formatted' : success === true }" @click="clicked">
    <Icon v-if="icon" :type="icon" :style="{ 'margin-right': $slots.default ? '10px' : '0px' }" />
    <slot />
    <transition name="check-fade">
      <div v-show="success" class="formatted-check">
        <Icon type="success" />
      </div>
    </transition>
  </button>
</template>

<script>
import { ref } from "vue";
import Icon from "./Icon.vue";

export default {
  components: {
    Icon
  },
  props: {
    icon: {
      type: String,
      required: false
    }
  },
  setup(props, { emit }) {
    const success = ref(false);

    const successful = () => {
      success.value = true;
      setTimeout(() => {
        success.value = false;
      }, 1250);
    };

    const clicked = () => {
      successful();
      emit("clicked");
    };
    return {
      success,
      successful,
      clicked
    };
  }
};
</script>

<style scoped>
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
.formatted {
  position: relative;
  overflow: hidden;
}
.formatted:after {
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
.formatted-check {
  position: absolute;
  left: 0;
  right: 0;
  top: 14px;
  z-index: 999;
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