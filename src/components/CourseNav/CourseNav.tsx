import {
  fetchArticleAsync,
  selectArticle,
} from "../../features/article/articleSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import "./CourseNav.css";
import { selectCourse } from "../../features/course/courseSlice";
import { useEffect, useState } from "react";
import {
  ArticleViewIndexes,
  changePage,
  getCompletedTasks,
  selectView,
  updateViewIndex,
} from "../../features/view/viewSlice";
import { findNextArticleId, findPrevArticleId } from "./findArticleId";
import { findModuleIndex, findNodeIndex, findSectionIndex } from "./findIndex";

function CourseNav() {
  const article = useAppSelector(selectArticle);
  const course = useAppSelector(selectCourse);
  const view = useAppSelector(selectView);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (article.active && article.content != undefined) {
      const indexes: ArticleViewIndexes = {
        nodeIndex: findNodeIndex(course, article.content?.id),
        sectionIndex: findSectionIndex(course, article.content?.id),
        moduleIndex: findModuleIndex(course, article.content?.id),
      };
      if (
        indexes.nodeIndex != undefined &&
        indexes.sectionIndex != undefined &&
        indexes.moduleIndex != undefined
      ) {
        if (
          !(
            indexes.nodeIndex === view.nodeIndex &&
            indexes.sectionIndex === view.sectionIndex &&
            indexes.moduleIndex === view.moduleIndex
          )
        ) {
          dispatch(updateViewIndex(indexes));
        }
      }
    }
  }, [article]);

  const completedTasks = useAppSelector(getCompletedTasks);
  const [nextDisabled, setNextDisabled] = useState(true);
  useEffect(() => {
    if (completedTasks.includes(false)) {
      setNextDisabled(true);
    } else {
      setNextDisabled(false);
    }
  }, [completedTasks]);

  const nextAction = () => {
    if (
      course.modules?.length === view.moduleIndex! + 1 &&
      course.modules![view.moduleIndex!].sections?.length ===
        view.sectionIndex! + 1 &&
      course.modules![view.moduleIndex!].sections![view.sectionIndex!].articles
        ?.length ===
        view.nodeIndex! + 1
    ) {
      dispatch(changePage("home"));
    } else {
      dispatch(
        fetchArticleAsync(
          course.id!.toString() +
            "/" +
            findNextArticleId(
              course,
              view.nodeIndex!,
              view.sectionIndex!,
              view.moduleIndex!
            )?.toString()
        )
      );
    }
  };

  return (
    <div className="CourseNav">
      <button
        className="app-lms-course-btn"
        disabled={false}
        id="course-back-btn"
        onClick={() => {
          dispatch(
            fetchArticleAsync(
              course.id!.toString() +
                "/" +
                findPrevArticleId(
                  course,
                  view.nodeIndex!,
                  view.sectionIndex!,
                  view.moduleIndex!
                )?.toString()
            )
          );
        }}
      >
        Back
      </button>
      <div id="course-page">
        {view.nodeIndex! + 1}/
        {
          course.modules![view.moduleIndex!].sections![view.sectionIndex!]
            .articles!.length
        }
      </div>
      <button
        className="app-lms-course-btn"
        disabled={nextDisabled}
        id="course-next-btn"
        onClick={nextAction}
      >
        Next
      </button>
    </div>
  );
}

export default CourseNav;
