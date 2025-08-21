<script lang="ts">
  import { onMount } from "svelte";
  import Fuse, { type FuseResult, type FuseResultMatch } from "fuse.js";

  const SEARCH_RESULT_LIMIT = 10;

  // 搜索关键词
  let keyword = $state("");

  type SearchData = {
    type: "post" | "page" | "tag" | "category";
    title: string;
    content?: string;
    url: string;
    score?: number;
    highlight?: string[];
    titleHighlight?: string[];
  };

  let loading = $state(true);
  let inputEl: HTMLInputElement | undefined;
  let data = $state<SearchData[]>([]);
  let fuse: Fuse<SearchData> | undefined;

  // 组件挂载时加载 JSON 数据
  onMount(async () => {
    data = await fetch("/search-data.json").then((r) => r.json());
    loading = false;

    data = data.map((item, id) => ({
      ...item,
      id,
    }));

    fuse = new Fuse(data, {
      keys: ["title", "content", "url"],
      useExtendedSearch: true,
      ignoreLocation: true,
      includeMatches: true,
      includeScore: true,
      minMatchCharLength: 2,
    });

    inputEl?.focus();
  });

  let results = $derived.by(() => {
    const query = keyword.trim();

    // no keyword, return all data
    if (!query) {
      return data;
    }

    const results = new Map<string, SearchData>();

    for (const item of nonFuzzySearch(query)) {
      results.set(item.url, item);
    }

    for (const item of fuse
      ?.search(keyword, { limit: SEARCH_RESULT_LIMIT })
      .map((res) => createHighlight(res)) ?? []) {
      results.set(item.url, item);
    }

    return [...results.values()];
  });

  function nonFuzzySearch(query: string): SearchData[] {
    const ret = [];
    query = query.toLowerCase();
    for (const item of data) {
      if (ret.length >= SEARCH_RESULT_LIMIT) {
        break;
      }
      const titleHighlight = createHighlightByKeyword(item.title, query);
      const contentHighlight = item.content
        ? createHighlightByKeyword(item.content, query)
        : undefined;
      if (titleHighlight || contentHighlight) {
        ret.push({
          ...item,
          titleHighlight,
          highlight: contentHighlight,
        });
      }
    }

    return ret;
  }

  function createHighlightByKeyword(text: string, keyword: string) {
    const st = text.toLowerCase().indexOf(keyword);
    if (st === -1) {
      return undefined;
    }
    const ed = st + keyword.length;
    return [
      text.slice(Math.max(0, st - 30), st),
      text.slice(st, ed),
      text.slice(ed),
    ];
  }

  function createHighlightByMatches(matches: FuseResultMatch) {
    const text = matches.value;
    if (!text || matches.indices.length < 1) {
      return ["", "", ""];
    }
    const maxIndice = matches.indices.reduce((prev, curr) => {
      const [prevSt, prevEd] = prev;
      const [currSt, currEd] = curr;
      return prevEd - prevSt < currEd - currSt ? curr : prev;
    }, matches.indices[0]);
    const [st, ed] = maxIndice;

    const startNumber = window.innerWidth > 768 ? 30 : 20; // Adjust based on screen size

    return [
      text.slice(Math.max(0, st - startNumber), st),
      text.slice(st, ed + 1),
      text.slice(ed + 1),
    ];
  }

  function createHighlight(item: FuseResult<SearchData>): SearchData {
    if (!item.matches || item.matches.length < 0) return item.item;

    const ret: SearchData = {
      ...item.item,
      highlight: undefined,
      titleHighlight: undefined,
    };

    for (const match of item.matches) {
      if (match.key === "title") {
        ret.titleHighlight = createHighlightByMatches(match);
      } else if (match.key === "content") {
        ret.highlight = createHighlightByMatches(match);
      }
    }
    return ret;
  }
</script>

<div class="search-box w-full">
  <div
    class="search-input-box w-full mt-2 p-2
    flex items-center gap-2
    rounded-lg border-(~ base-300)
    hover:border-(primary/60)
  "
  >
    <div class="i-mingcute:search-3-line"></div>
    <input
      id="inline-search-input"
      name="search-input"
      aria-label="搜索"
      class="border-none! outline-none! grow text-lg"
      type="text"
      placeholder="搜索博客文章、页面、标签、分类……"
      bind:value={keyword}
      bind:this={inputEl}
    />
  </div>

  <div class="search-results-container mt-4">
    <div class="results-list flex flex-col gap-2">
      {#if loading}
        <!-- just some random numbers here -->
        {#each [20, 20, 12, 13, 10, 12, 19, 11, 18, 16] as i}
          <div class="loading-item p-4 flex gap-4 animate-pulse">
            <div class="icon-container text-xl">
              <div class="i-mingcute:file-line"></div>
            </div>
            <div class="result-body w-full">
              <div
                class="loading-title h-4 bg-base-content/30 mb-2 rounded-lg"
                style={`width: ${i}em`}
              ></div>
              <div
                class="loading-content h-4 w-full bg-base-content/15 mb-2 rounded-lg"
              ></div>
            </div>
          </div>
        {/each}
      {:else}
        {#each results.slice(0, SEARCH_RESULT_LIMIT) as result}
          <div class="result-item p-4 flex gap-4 hover:bg-primary/10 clickable">
            <a
              href={result.url}
              class="clickable-bkg-link"
              data-astro-prefetch
              aria-label={result.title}
            ></a>
            <div class="icon-container text-xl">
              {#if result.type === "post" || result.type === "page"}
                <div class="i-mingcute:file-line"></div>
              {:else if result.type === "tag"}
                <div class="i-mingcute:tag-line"></div>
              {:else if result.type === "category"}
                <div class="i-mingcute:folder-2-line"></div>
              {/if}
            </div>
            <div class="result-body">
              <div class="result-title font-bold">
                {#if result.titleHighlight}
                  {result.titleHighlight[0]}<mark
                    >{result.titleHighlight[1]}</mark
                  >{result.titleHighlight[2]}
                {:else}
                  {result.title}
                {/if}
              </div>
              {#if result.type === "post" || result.type === "page"}
                <div class="result-content break-anywhere line-clamp-1">
                  {#if result.highlight}
                    {result.highlight[0]}<mark>{result.highlight[1]}</mark
                    >{result.highlight[2]}
                  {:else}
                    {result.content}
                  {/if}
                </div>
              {/if}
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>
