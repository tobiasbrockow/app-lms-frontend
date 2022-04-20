import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  changeArticle,
  changeArticleAsync,
  InstructionState,
  NodeSelector,
  NodeState,
  ParagraphContentState,
  ParagraphState,
  selectArticle,
  TaskState,
} from "../../features/article/articleSlice";
import { highlightElement, removeHighlight } from "./highlight";
import "./Article.css";
import {
  selectEditMode,
  selectUnsavedChanges,
  setCompletedTasks,
  setTaskToComplete,
  setUnsavedChanges,
} from "../../features/view/viewSlice";
import { NodeEdit } from "./ArticleEdit";

export const Article = () => {
  const article = useAppSelector(selectArticle);
  const unsavedChanges = useAppSelector(selectUnsavedChanges);
  const editMode = useAppSelector(selectEditMode);
  const dispatch = useAppDispatch();

  const [oldArticle, setOldArticle] = useState(article);

  const handleSave = () => {
    dispatch(changeArticleAsync(article));
    setOldArticle(article);
    dispatch(setUnsavedChanges(false));
  };

  const handleCancel = () => {
    dispatch(changeArticle(oldArticle));
    dispatch(setUnsavedChanges(false));
  };

  if (article.active) {
    return (
      <div className={"app-lms-article"}>
        {unsavedChanges ? (
          <div className="app-lms-article-save-area">
            <div>You have unsaved changes</div>
            <button id="app-lms-cancel-changes" onClick={handleCancel}>
              Cancel
            </button>
            <button id="app-lms-save-changes" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        ) : (
          ""
        )}
        <div className="app-lms-article-title">{article.content?.title}</div>
        <div className="app-lms-article-content">
          {editMode ? (
            <NodeEdit node={article.content!.node} />
          ) : (
            <Node node={article.content!.node} />
          )}
          {article.content!.instruction !== undefined ? (
            <Instruction instruction={article.content!.instruction} />
          ) : (
            ""
          )}
        </div>
      </div>
    );
  } else {
    return <div className="app-lms-article">No Article selected.</div>;
  }
};

const Node = ({ node }: NodeProps) => {
  return (
    <div className="app-lms-node">
      {node.paragraphs.map((p, i) => {
        return <Paragraph p={p} pI={i} key={i} />;
      })}
    </div>
  );
};

const Paragraph = ({ p, pI }: ParagraphProps) => {
  if (p.paragraphType === "text") {
    return (
      <div className="app-lms-paragraph">
        {p.content.map((content, i) => {
          return <Span span={content} key={i} pI={pI} sI={i} />;
        })}
      </div>
    );
  } else if (p.paragraphType === "list") {
    return (
      <div className="app-lms-paragraph">
        <ul className="app-lms-list">
          {p.content.map((content, i) => {
            return <List list={content} key={i} />;
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

const Span = ({ span }: SpanProps) => {
  if (span.selector === undefined) {
    return <span className={span.format}>{span.value}</span>;
  } else {
    return <SpanWithSelector span={span} />;
  }
};

const SpanWithSelector = ({ span }: SpanProps) => {
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

const List = ({ list }: ListProps) => {
  return (
    <li>
      {list.listSpans?.map((span, i) => {
        return <Span span={span} key={i} />;
      })}
    </li>
  );
};

const Instruction = ({ instruction }: InstructionProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let initialTaskStatus = [];
    for (let i = 0; i < instruction.tasks!.length; i++) {
      initialTaskStatus.push(false);
    }
    dispatch(setCompletedTasks(initialTaskStatus));
    return () => {
      dispatch(setCompletedTasks([true]));
    };
  }, []);

  return (
    <div className="app-lms-node-instructions">
      <div className="app-lms-instruction-headline">Instructions</div>
      {instruction.tasks!.map((t, i) => {
        return <Task task={t} key={i} index={i} />;
      })}
    </div>
  );
};

const Task = ({ task, index }: TaskProps) => {
  return (
    <div className="app-lms-task">
      <Checkbox
        selector={task.selector}
        requirement={task.requirement}
        index={index}
      />
      <div className="app-lms-task-content">
        <div className="app-lms-task-title">{task.title}</div>
        <div className="app-lms-task-des">{task.description}</div>
      </div>
    </div>
  );
};

const Checkbox = ({ selector, requirement, index }: Checkbox) => {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<
    "initial" | "loading" | "success" | "error"
  >("initial");

  const article = useAppSelector(selectArticle);
  useEffect(() => {
    setStatus("initial");
  }, [article]);

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (
        e
          .composedPath()
          .includes(
            document.querySelectorAll(selector?.selector!)[selector?.index!]
          )
      ) {
        setStatus("success");
        dispatch(setTaskToComplete(index));
        document.removeEventListener("click", clickHandler);
      } else {
        setStatus("initial");
      }
    };

    if (requirement === "element-visible") {
      setStatus("loading");
      const timer = window.setTimeout(() => {
        const elementVisible =
          document.querySelectorAll(selector?.selector!)[selector?.index!] !=
          undefined;
        if (elementVisible) {
          setStatus("success");
          dispatch(setTaskToComplete(index));
        } else {
          setStatus("error");
        }
      }, 1000);
    } else if (requirement === "click") {
      document.addEventListener("click", clickHandler);
    }
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, [article]);

  return <div className="app-lms-task-checkbox" data-status={status}></div>;
};

export interface NodeProps {
  node: NodeState;
}

export interface ParagraphProps {
  p: ParagraphState;
  pI: number;
}

export interface SpanProps {
  span: ParagraphContentState;
  sI?: number;
  pI?: number;
}

export interface ListProps {
  list: ParagraphContentState;
}

export interface InstructionProps {
  instruction: InstructionState;
}

export interface TaskProps {
  task: TaskState;
  index: number;
}

interface Checkbox {
  selector: NodeSelector | undefined;
  requirement: "element-visible" | "click";
  index: number;
}
