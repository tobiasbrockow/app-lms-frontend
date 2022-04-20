import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  addArticle,
  addEmptyModule,
  addfirstModule,
  addSection,
  ArticleState,
  changeArticleTitle,
  changeCourseAsync,
  changeModuleTitle,
  changeSectionTitle,
  CourseState,
  deleteArticle,
  deleteModule,
  deleteSection,
  ModuleState,
  SectionState,
  selectCourse,
} from "../../features/course/courseSlice";
import {
  fetchArticleAsync,
  selectArticle,
} from "../../features/article/articleSlice";
import { changePage, selectEditMode } from "../../features/view/viewSlice";
import "./CourseMenu.css";

export const CourseMenu = () => {
  const course = useAppSelector(selectCourse);
  const editMode = useAppSelector(selectEditMode);

  if (editMode) {
    return <CourseMenuEditMode />;
  } else if (course.modules === undefined) {
    return (
      <div className="app-lms-course-menu">
        <h2>{course.title}</h2>
        <div>No content defined yet. Go to edit mode to add content.</div>
      </div>
    );
  } else {
    return (
      <div className="app-lms-course-menu">
        <h2>{course.title}</h2>
        {course.modules!.map((m, iM) => {
          return <Module module={m} key={m.id} />;
        })}
      </div>
    );
  }
};

const Module = ({ module }: ModuleProps) => {
  return (
    <div className="app-lms-module">
      <div className="app-lms-module-title">{module.title}</div>
      {module.sections!.map((s, iS) => {
        return <Section section={s} moduleId={module.id} key={s.id} />;
      })}
    </div>
  );
};

const Section = ({ section }: SectionProps) => {
  return (
    <div className="app-lms-section">
      <div className="app-lms-section-title">{section.title}</div>
      <div className="app-lms-articles">
        {section.articles!.map((a, iA) => {
          return <Article article={a} key={a.id} />;
        })}
      </div>
    </div>
  );
};

const Article = ({ article }: ArticleProps) => {
  const dispatch = useAppDispatch();
  const course = useAppSelector(selectCourse);
  const node = useAppSelector(selectArticle);

  const handleClick = () => {
    dispatch(
      fetchArticleAsync(course.id!.toString() + "/" + article.id.toString())
    );
    dispatch(changePage("course"));
  };

  if (node.active) {
    if (node.content?.id === article.id) {
      return (
        <div onClick={handleClick} className="app-lms-active-article">
          {article.title}
        </div>
      );
    } else {
      return <div onClick={handleClick}>{article.title}</div>;
    }
  } else {
    return <div onClick={handleClick}>{article.title}</div>;
  }
};

const CourseMenuEditMode = () => {
  const course = useAppSelector(selectCourse);
  const dispatch = useAppDispatch();

  const handleNewModuleClick = () => {
    if (course.modules === undefined) {
      dispatch(addfirstModule());
    } else {
      dispatch(addEmptyModule());
    }
  };

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [oldCourse, setOldCourse] = useState<CourseState>();
  const [newCourse, setNewCourse] = useState<CourseState>();
  useEffect(() => {
    setNewCourse(course);
    if (oldCourse !== newCourse) {
      setUnsavedChanges(true);
    }
    return () => {
      setOldCourse(course);
    };
  }, [course]);

  const handleSave = () => {
    dispatch(changeCourseAsync(course));
    setUnsavedChanges(false);
  };

  if (course.modules === undefined) {
    return (
      <div className="app-lms-course-menu">
        <h2>{course.title}</h2>
        <div
          className="app-lms-course-menu-module-new"
          onClick={handleNewModuleClick}
        >
          Add new module
        </div>
      </div>
    );
  } else {
    return (
      <div className="app-lms-course-menu-wrapper">
        {unsavedChanges ? (
          <div className="app-lms-course-menu-save-area">
            <div>You have unsaved changes</div>
            <button id="app-lms-cancel-changes">Cancel</button>
            <button id="app-lms-save-changes" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        ) : (
          ""
        )}
        <h2>{course.title}</h2>
        <div className="app-lms-course-menu">
          {course.modules!.map((m, iM) => {
            return <ModuleEdit module={m} key={m.id} />;
          })}
          <div
            className="app-lms-course-menu-module-new"
            onClick={handleNewModuleClick}
          >
            Add new module
          </div>
        </div>
      </div>
    );
  }
};

interface ModuleProps {
  module: ModuleState;
}

const ModuleEdit = ({ module }: ModuleProps) => {
  const dispatch = useAppDispatch();

  const [menuVisible, setMenuVisible] = useState(false);
  const handleMouseEnter = () => {
    setMenuVisible(true);
  };
  const handleMouseLeave = () => {
    setMenuVisible(false);
  };

  const [optionsVisible, setOptionsVisible] = useState(false);
  const handleOptionsClick = () => {
    optionsVisible ? setOptionsVisible(false) : setOptionsVisible(true);
  };

  const handleTitleChange = (e: React.FormEvent<HTMLInputElement>) => {
    dispatch(
      changeModuleTitle({ id: module.id, title: e.currentTarget.value })
    );
  };

  const handleDelete = () => {
    dispatch(deleteModule(module.id));
  };

  return (
    <div
      className="app-lms-module"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="app-lms-title-wrapper">
        <input
          className="app-lms-module-title"
          placeholder="Enter Module title"
          defaultValue={module.title}
          onBlur={handleTitleChange}
        />
        <div
          className="app-lms-module-options-dots"
          onClick={handleOptionsClick}
        ></div>
        {optionsVisible ? (
          <div className="app-lms-options-menu">
            <div onClick={handleDelete}>Delete module</div>
          </div>
        ) : (
          ""
        )}
      </div>
      {module.sections!.map((s, iS) => {
        return <SectionEdit section={s} moduleId={module.id} key={s.id} />;
      })}
    </div>
  );
};

interface SectionProps {
  section: SectionState;
  moduleId: number;
}

const SectionEdit = ({ section, moduleId }: SectionProps) => {
  const dispatch = useAppDispatch();

  const handleTitleChange = (e: React.FormEvent<HTMLInputElement>) => {
    dispatch(
      changeSectionTitle({ id: section.id, title: e.currentTarget.value })
    );
  };

  const [optionsVisible, setOptionsVisible] = useState(false);
  const handleMenuClick = () => {
    optionsVisible ? setOptionsVisible(false) : setOptionsVisible(true);
  };

  const handleDelete = () => {
    dispatch(deleteSection(section.id));
  };

  const [sectionHover, setSectionHover] = useState(false);
  const handleMouseEnter = () => {
    setSectionHover(true);
  };
  const handleMouseLeave = () => {
    setSectionHover(false);
  };

  const handleNewArticle = () => {
    dispatch(addArticle(section.id));
  };

  const handleNewSection = () => {
    dispatch(addSection(moduleId));
  };

  return (
    <div
      className="app-lms-section"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="app-lms-title-wrapper">
        <input
          className="app-lms-section-title"
          placeholder="Enter Section title"
          defaultValue={section.title}
          onBlur={handleTitleChange}
        />
        <div
          className="app-lms-section-menu-dots"
          onClick={handleMenuClick}
        ></div>
        {optionsVisible ? (
          <div className="app-lms-options-menu">
            <div onClick={handleDelete}>Delete section</div>
          </div>
        ) : (
          ""
        )}
      </div>
      {section.articles!.map((a, iS) => {
        return <ArticleEdit article={a} key={a.id} />;
      })}
      <div className="app-lms-new-section-article">
        {sectionHover ? (
          <div
            className="app-lms-new-article-section-add"
            onClick={handleNewArticle}
          >
            Add new Article
          </div>
        ) : (
          ""
        )}
        {sectionHover ? (
          <div
            className="app-lms-new-article-section-add"
            onClick={handleNewSection}
          >
            Add new section
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

interface ArticleProps {
  article: ArticleState;
}

const ArticleEdit = ({ article }: ArticleProps) => {
  const dispatch = useAppDispatch();

  const handleTitleChange = (e: React.FormEvent<HTMLInputElement>) => {
    dispatch(
      changeArticleTitle({ id: article.id, title: e.currentTarget.value })
    );
  };

  const [optionsVisible, setOptionsVisible] = useState(false);
  const handleMenuClick = () => {
    optionsVisible ? setOptionsVisible(false) : setOptionsVisible(true);
  };

  const handleDelete = () => {
    dispatch(deleteArticle(article.id));
  };

  return (
    <div className="app-lms-articles">
      <div className="app-lms-title-wrapper">
        <input
          className="app-lms-article-title-edit"
          placeholder="Enter Article title"
          defaultValue={article.title}
          onBlur={handleTitleChange}
        />
        <div
          className="app-lms-section-menu-dots"
          onClick={handleMenuClick}
        ></div>
        {optionsVisible ? (
          <div className="app-lms-options-menu">
            <div onClick={handleDelete}>Delete article</div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
