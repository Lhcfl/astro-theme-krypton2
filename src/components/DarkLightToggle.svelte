<script lang="ts">
  import { onMount } from "svelte";
  const currentTheme = () =>
    document.documentElement.dataset.theme ||
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");

  const palettes = [
    "light",
    "dark",
    "lightPurplePink",
    "darkPurplePink",
    "lightRedOrange",
    "darkRedOrange",
    "lightGreenBlue",
    "darkGreenBlue",
    "lightCyanYellow",
    "darkCyanYellow",
    "lightBrownGold",
    "darkBrownGold",
  ];

  let isDark = $state(false);

  let btnClass = $derived(
    isDark ? "i-mingcute:sun-line" : "i-mingcute:moon-stars-line",
  );

  const setTheme = (next = true) => {
    const theme = currentTheme();
    isDark = theme.startsWith("dark");
    const idx = (palettes.indexOf(theme) + Number(next)) % palettes.length;
    const newTheme = palettes[idx == -1 ? 0 : idx];
    document.documentElement.dataset.theme = newTheme;
    return newTheme;
  };

  onMount(() => {
    setTheme(false);
    document.addEventListener("astro:after-swap", () => setTheme(false));
  });

  const toggleTheme = () => {
    const newTheme = setTheme();
    localStorage.setItem("theme", newTheme);
  };
</script>

<button class={btnClass} aria-label="toggle theme" onclick={toggleTheme}>
</button>
