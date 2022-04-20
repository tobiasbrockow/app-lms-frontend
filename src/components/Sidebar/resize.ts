import React from "react";

export const resizeSidebar = (e: React.MouseEvent) => {
  const BORDER_WIDTH = 4;
  const sidebar = document.querySelector<HTMLElement>(".Sidebar")!;
  const root = document.querySelector<HTMLElement>("#root")!;
  let mousePos = 0,
    newWidth = 0,
    isResizing = false;
  const width = sidebar.offsetWidth;

  const handleMouseMove = (e: MouseEvent) => {
    const xDif = e.x - mousePos;
    mousePos = e.x;
    newWidth = parseInt(getComputedStyle(sidebar, "").width) + xDif;
    sidebar.style.width = (newWidth <= 400 ? 400 : newWidth) + "px";
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (isResizing) {
      document.removeEventListener("mousemove", handleMouseMove);
      root.style.cursor = "initial";
      isResizing = false;
    }
  };

  // Check if the click is on the right resize border of the Sidebar
  if (width - e.nativeEvent.offsetX <= BORDER_WIDTH) {
    isResizing = true;
    e.preventDefault();
    mousePos = e.nativeEvent.x;
    root.style.cursor = "ew-resize";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }
};
