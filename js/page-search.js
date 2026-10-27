document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#pageSearchForm");
  const input = document.querySelector("#pageSearchInput");
  const clearButton = document.querySelector("#pageSearchClear");
  const prevButton = document.querySelector("#pageSearchPrev");
  const nextButton = document.querySelector("#pageSearchNext");
  const status = document.querySelector("#pageSearchStatus");

  // Пошук обмежується основним вмістом сторінки.
  // Якщо елемента <main> немає, пошук виконується в body.
  const searchRoot = document.querySelector("main") || document.body;

  if (!form || !input || !status) return;

  let matches = [];
  let currentMatch = -1;

  function removeHighlights() {
    searchRoot.querySelectorAll("mark.search-highlight").forEach((mark) => {
      mark.replaceWith(document.createTextNode(mark.textContent));
    });

    searchRoot.normalize();
    matches = [];
    currentMatch = -1;
  }

  function updateButtons() {
    const hasMatches = matches.length > 0;

    if (prevButton) prevButton.disabled = !hasMatches;
    if (nextButton) nextButton.disabled = !hasMatches;
  }

  function showMatch(index) {
    if (!matches.length) return;

    currentMatch = (index + matches.length) % matches.length;

    matches[currentMatch].scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    status.textContent =
      `Збіг ${currentMatch + 1} з ${matches.length}.`;
  }

  function searchPage(query) {
    removeHighlights();

    const term = query.trim();

    if (!term) {
      status.textContent = "Введіть текст для пошуку.";
      updateButtons();
      return;
    }

    const normalizedTerm = term.toLocaleLowerCase("uk");

    const walker = document.createTreeWalker(
      searchRoot,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;

          if (!parent || !node.textContent.trim()) {
            return NodeFilter.FILTER_REJECT;
          }

          // Не шукаємо в самій формі, коді та полях введення.
          if (
            parent.closest(
              ".page-search, script, style, noscript, textarea, input, button, select"
            )
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes = [];

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    for (const textNode of textNodes) {
      const originalText = textNode.textContent;
      const normalizedText = originalText.toLocaleLowerCase("uk");

      let position = 0;
      let foundAt = normalizedText.indexOf(normalizedTerm, position);

      if (foundAt === -1) continue;

      const fragment = document.createDocumentFragment();

      while (foundAt !== -1) {
        if (foundAt > position) {
          fragment.append(
            document.createTextNode(originalText.slice(position, foundAt))
          );
        }

        const mark = document.createElement("mark");
        mark.className = "search-highlight";
        mark.textContent = originalText.slice(
          foundAt,
          foundAt + term.length
        );

        fragment.append(mark);
        matches.push(mark);

        position = foundAt + term.length;
        foundAt = normalizedText.indexOf(normalizedTerm, position);
      }

      if (position < originalText.length) {
        fragment.append(
          document.createTextNode(originalText.slice(position))
        );
      }

      textNode.replaceWith(fragment);
    }

    if (matches.length) {
      status.textContent = `Знайдено збігів: ${matches.length}.`;
      updateButtons();
      showMatch(0);
    } else {
      status.textContent = "Збігів не знайдено.";
      updateButtons();
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    searchPage(input.value);
  });

  clearButton?.addEventListener("click", () => {
    removeHighlights();
    input.value = "";
    status.textContent = "";
    updateButtons();
    input.focus();
  });

  nextButton?.addEventListener("click", () => {
    showMatch(currentMatch + 1);
  });

  prevButton?.addEventListener("click", () => {
    showMatch(currentMatch - 1);
  });

  updateButtons();
});
