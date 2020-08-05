<template>
  <div>
    <svg v-if="type === 'format'" width="16" height="14" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 0h16v2H0V0zm0 12h16v2H0v-2zm0-4h6v2H0V8zm0-4h6v2H0V4zm12 2V3l4 4-4 4V8H8V6h4z"
        fill="#FFF"
        fill-rule="nonzero"
      />
    </svg>
    <svg
      v-if="type === 'success'"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
    >
      <path d="M6.61 11.89L3.5 8.78 2.44 9.84 6.61 14l8.95-8.95L14.5 4z" fill="#fff" />
    </svg>
    <svg
      v-if="type === 'save'"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-save"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
      validator: function(value) {
        return ["format", "copy", "success"].indexOf(value) !== -1;
      }
    }
  }
};
</script>