<script lang="ts">
  import { onMount } from "svelte";
  const currentTheme = () =>
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");

  let isDark = $state(false);

  let btnClass = $derived(
    isDark ? "i-mingcute:sun-line" : "i-mingcute:moon-stars-line",
  );

  const setTheme = () => {
    const theme = currentTheme();
    isDark = theme == "dark";
    switch (theme) {
      case "dark":
        document.documentElement.dataset.theme = "dark";
        break;
      case "light":
        document.documentElement.dataset.theme = "light";
        break;
    }
  };

  onMount(() => {
    setTheme();
    document.addEventListener("astro:after-swap", setTheme);
  });

  const toggleTheme = () => {
    const newTheme = currentTheme() === "dark" ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    setTheme();
  };
</script>

<button class={btnClass} aria-label="toggle theme" onclick={toggleTheme}>
</button>
