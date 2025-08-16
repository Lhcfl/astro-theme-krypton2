<script lang="ts">
  import { onMount } from "svelte";
  import WordCloud from "wordcloud";

  type Props = {
    list: [string, number, string?][];
    rotateRatio?: number;
    rotationSteps?: number;
    className?: string;
    shrinkToFit?: boolean;
  };

  let { className, ...props }: Props = $props();
  let canvasEl: HTMLElement;

  onMount(() => {
    const divWidth = canvasEl.clientWidth;
    const wfactor = Math.sqrt(Math.min(768, divWidth) / 768);
    const factor = 14 * wfactor;
    const gridSize = 18 * wfactor;
    WordCloud([canvasEl], {
      gridSize,
      weightFactor: (size) => Math.log2(size + 1) * factor,
      click: ([name, number, href]) => {
        if (!href) return;
        const a = document.createElement("a");
        a.href = href;
        document.body.appendChild(a);
        a.click();
      },
      ...props,
    });
  });
</script>

<div bind:this={canvasEl} class={className}></div>
