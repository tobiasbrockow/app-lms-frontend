import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchArticleAsync,
  selectArticle,
} from "../../features/article/articleSlice";
import "./Article.css";
import CourseNav from "../CourseNav/CourseNav";
import { Article } from "./Article";
import { selectCourse } from "../../features/course/courseSlice";
import { selectView } from "../../features/view/viewSlice";
import { CourseMenu } from "../CourseMenu/CourseMenu";

function Course() {
  const course = useAppSelector(selectCourse);
  const view = useAppSelector(selectView);
  const node = useAppSelector(selectArticle);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      course.active &&
      node.active === false &&
      course.modules !== undefined
    ) {
      dispatch(
        fetchArticleAsync(
          course.id?.toString() +
            "/" +
            course.modules![0].sections![0].articles![0].id.toString()
        )
      );
    }
  }, [course.active]);

  if (view.page === "course-menu") {
    return (
      <div className="CourseMenu">
        <CourseMenu />
      </div>
    );
  } else {
    return (
      <div className="Course">
        {course.active && node.loading ? (
          <div className="app-lms-meter">
            <span className="app-lms-progress"></span>
          </div>
        ) : (
          ""
        )}
        {course.active && node.active ? <Article /> : ""}
        {course.active && node.active ? <CourseNav /> : ""}
        {course.active && !node.active && !node.loading ? (
          <div className="app-lms-no-content">
            This article doesn't have any content or doesn't exist. It's not
            possible yet to edit it. However, it's possible to edit the text of
            existing articles. Go to the demo course and give it a try!
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Course;
