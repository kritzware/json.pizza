<template>
  <div class="saved-container">
    <div class="grid-container" style="margin-top:300px;">
      <div v-for="snippet of snippets" :key="snippet.ts" @click="load(snippet)" class="grid-item">
        <div>
          <h3>{{ snippet.name }}</h3>
          <div style="font-size:12px;">{{ snippet.description }}</div>
          <div style="font-size:11px;color:grey;">{{ snippet.ts }}</div>
          <pre>{{ JSON.stringify(snippet.data, null, 2).slice(0, 70) }}...</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line
import { ref, Ref } from "vue";
// import Button from "@/components/Button.vue";
import { useLocalStorage, StorageKey } from "@/composables/localStorage";
import router from "@/router";

export default {
  components: {
    // Button
  },
  props: {
    theme: {
      type: String,
      required: true
    }
  },
  // eslint-disable-next-line
  setup(props, ctx) {
    const snippets = [];

    const content = useLocalStorage(
      StorageKey.FORMAT,
      JSON.stringify(
        [
          {
            name: "Margherita",
            base: "tomato",
            toppings: ["mozzarella", "basil", "olive oil"],
            quantity: 5,
            cooked: false
          }
        ],
        null,
        2
      )
    );

    for (let i = 0; i < 8; i++) {
      snippets.push({
        ts: new Date().toDateString(),
        name: `Name ${i}`,
        description: "Short description text",
        data: [
          {
            name: `Margherita ${i}`,
            base: "tomato",
            toppings: ["mozzarella", "basil", "olive oil"],
            quantity: 10,
            cooked: false
          }
        ]
      });
    }

    const load = (snippet: any) => {
      content.value = snippet.data;
      router.push("/?af=1");
    };

    return {
      snippets,
      load
    };
  }
};
</script>

<style scoped>
.saved-container {
  width: 100%;
  margin-left: ;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 1px 1px;
  grid-template-areas: ". . ." ". . ." ". . .";
  font-family: Roboto Mono, monospace;
}
.grid-item {
  background-color: #171718;
  color: white;
  border-radius: 6px;
  padding: 24px 28px;
  font-size: 14px;
  line-height: 2;
  box-shadow: 0 16px 40px -4px rgba(0, 0, 5, 0.4);
  /* margin-left: 10px; */
  width: 350px;
  height: 300px;
  margin-top: 50px;
  cursor: pointer;
}
.grid-item pre {
  font-family: Roboto Mono, monospace;
  /* -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(2px); */
}
/* For presentation only, no need to copy the code below */
/* .grid-container * {
  border: 1px solid red;
  position: relative;
}
.grid-container *:after {
  content: attr(class);
  position: absolute;
  top: 0;
  left: 0;
} */

/* .action-buttons {
  position: fixed;
  right: 66px;
  bottom: 46px;
  color: white;
  z-index: 999;
  display: flex;
  align-items: center;
}
.action-buttons button {
  margin-left: 8px;
} */
</style>