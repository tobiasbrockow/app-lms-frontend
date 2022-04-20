import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  addParagraph,
  changeSpan,
  deleteParagraph,
} from "../../features/article/articleSlice";
import { highlightElement, removeHighlight } from "./highlight";
import "./Article.css";
import {
  getSelectedText,
  selectUnsavedChanges,
  setUnsavedChanges,
} from "../../features/view/viewSlice";
import { ListProps, NodeProps, ParagraphProps, SpanProps } from "./Article";
import { handleSpanSeperation, restoreSpanSeperation } from "./ArticleHelpers";

export const NodeEdit = ({ node }: NodeProps) => {
  const [textSelected, setTextSelected] = useState(false);

  /* Text formatting, work in progress, temporarly deactivated
  useEffect(() => {
    const handleMouseUp = () => {
      console.log(window.getSelection());
      if (window.getSelection()?.type === "Range" && !textSelected) {
        setTextSelected(true);
        handleSpanSeperation(
          window.getSelection()!.anchorNode!,
          window.getSelection()?.anchorOffset!,
          window.getSelection()?.focusOffset!
        );
      } else if (textSelected) {
        setTextSelected(false);
        restoreSpanSeperation();
      }
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [textSelected]);
  */

  return (
    <div className="app-lms-node app-lms-node-edit">
      {node.paragraphs.map((p, i) => {
        return <ParagraphEdit p={p} pI={i} key={i} />;
      })}
    </div>
  );
};

const ParagraphEdit = ({ p, pI }: ParagraphProps) => {
  const selectedText = useAppSelector(getSelectedText);
  useEffect(() => {
    return () => {};
  }, [selectedText]);
  if (p.paragraphType === "text") {
    return (
      <div className="app-lms-paragraph">
        {p.content.map((content, i) => {
          return <SpanEdit span={content} key={i} pI={pI} sI={i} />;
        })}
      </div>
    );
  } else if (p.paragraphType === "list") {
    return (
      <div className="app-lms-paragraph">
        <ul className="app-lms-list">
          {p.content.map((content, i) => {
            return <ListEdit list={content} key={i} />;
          })}
        </ul>
      </div>
    );
  } else if (p.paragraphType === "image") {
    return (
      <div className="app-lms-paragraph">
        {p.content.map((content, i) => {
          return (
            <img
              src={content.image?.src}
              alt={content.image?.alt}
              key={i}
            ></img>
          );
        })}
      </div>
    );
  } else {
    return <div></div>;
  }
};

const SpanEdit = ({ span, sI, pI }: SpanProps) => {
  const dispatch = useAppDispatch();
  const unsavedChanges = useAppSelector(selectUnsavedChanges);

  const [oldText, setOldText] = useState("");
  const handleFocus = (e: React.FocusEvent<HTMLSpanElement>) => {
    setOldText(e.currentTarget.innerText);
  };
  const handleTextChange = (e: React.FocusEvent<HTMLSpanElement>) => {
    const newText = e.currentTarget.innerText;
    if (oldText !== newText) {
      dispatch(changeSpan({ text: newText, sI: sI!, pI: pI! }));
      if (!unsavedChanges) {
        dispatch(setUnsavedChanges(true));
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter") {
      dispatch(addParagraph(pI!));
      e.currentTarget.blur();
      setTimeout(function () {
        document
          .querySelectorAll<HTMLDivElement>(".app-lms-paragraph")
          [pI! + 1]!.querySelector<HTMLSpanElement>("span")!
          .focus();
      }, 0);
      if (!unsavedChanges) {
        dispatch(setUnsavedChanges(true));
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Backspace" && e.currentTarget.innerText === "") {
      e.currentTarget.blur();
      dispatch(deleteParagraph(pI!));
      if (!unsavedChanges) {
        dispatch(setUnsavedChanges(true));
      }
    }
  };

  if (span.selector === undefined) {
    return (
      <span
        className={"app-lms-text-span-edit" + " " + span.format}
        contentEditable={true}
        onFocus={handleFocus}
        onBlur={handleTextChange}
        suppressContentEditableWarning={true}
        onKeyPress={handleKeyPress}
        onKeyDown={handleKeyDown}
      >
        {span.value}
      </span>
    );
  } else {
    return <SpanWithSelectorEdit span={span} />;
  }
};

const SpanWithSelectorEdit = ({ span }: SpanProps) => {
  return (
    <span
      className={"app-lms-underlying-app-marker"}
      onMouseOver={() => {
        highlightElement(span.selector);
      }}
      onMouseLeave={() => {
        removeHighlight(span.selector);
      }}
    >
      {span.value}
    </span>
  );
};

const ListEdit = ({ list }: ListProps) => {
  return (
    <li>
      {list.listSpans?.map((span, i) => {
        return <SpanEdit span={span} key={i} />;
      })}
    </li>
  );
};
