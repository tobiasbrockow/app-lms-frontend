export const handleSpanSeperation = (
  node: Node,
  startI: number,
  endI: number
) => {
  const fullText = node.textContent;
  let textBefore,
    selectedText,
    textAfter = "";
  if (startI < endI) {
    textBefore = fullText!.slice(0, startI);
    selectedText = fullText!.slice(startI, endI);
    textAfter = fullText!.slice(endI);
  } else {
    textBefore = fullText!.slice(0, endI);
    selectedText = fullText!.slice(endI, startI);
    textAfter = fullText!.slice(startI);
  }
  const firstNode = document.createElement("span");
  firstNode.innerText = textBefore;
  firstNode.id = "app-lms-temporary-span";

  const midNode = document.createElement("span");
  midNode.innerText = selectedText;
  midNode.className = "app-lms-selected-text";
  midNode.id = "app-lms-temporary-span";
  const selectionPopup = document.createElement("div");
  selectionPopup.id = "app-lms-text-selection-popup";
  midNode.appendChild(selectionPopup);

  const lastNode = document.createElement("span");
  lastNode.innerText = textAfter;
  lastNode.id = "app-lms-temporary-span";
  const paragraph = node.parentElement?.parentElement;
  const span = node.parentElement;
  span?.classList.add("app-lms-hide-span");
  paragraph?.insertBefore(firstNode, span);
  paragraph?.insertBefore(midNode, span);
  paragraph?.insertBefore(lastNode, span);
};

export const restoreSpanSeperation = () => {
  document
    .querySelector("span.app-lms-hide-span")!
    .classList.remove("app-lms-hide-span");
  document
    .querySelectorAll("span#app-lms-temporary-span")!
    .forEach((e) => e.remove());
};
