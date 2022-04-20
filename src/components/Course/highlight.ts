import React from "react";
import { NodeSelector } from "../../features/article/articleSlice";

export const highlightElement = (selector: NodeSelector | undefined) => {
  const element = document.querySelectorAll(selector?.selector!)[
    selector?.index!
  ];
  if (element != undefined) {
    element.classList.add("selected-by-app-lms");
  } else {
    console.log("Can't find the element. Check selector.");
  }
};

export const removeHighlight = (selector: NodeSelector | undefined) => {
  const element = document.querySelectorAll(selector?.selector!)[
    selector?.index!
  ];
  if (element != undefined) {
    element.classList.remove("selected-by-app-lms");
  } else {
    console.log("Can't find the element. Check selector.");
  }
};
