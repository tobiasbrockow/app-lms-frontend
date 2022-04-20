import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectPage } from "../../features/view/viewSlice";
import {
  addAllCourses,
  CoursesState,
} from "../../features/courses/coursesSlice";
import Course from "../Course/Course";
import Dashboard from "../Dashboard/Dashboard";

function Body() {
  const page = useAppSelector(selectPage);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchAllCourses = async () => {
      const response: CoursesState = await fetch(
        "https://applmsbe.herokuapp.com/courses/all",
        { method: "GET", credentials: "include" }
      ).then((response) => response.json());
      dispatch(addAllCourses(response));
    };

    fetchAllCourses();
  }, []);

  switch (page) {
    case "home":
      return <Dashboard />;
    case "course":
      return <Course />;
    case "course-menu":
      return <Course />;
    default:
      return <Dashboard />;
  }
}

export default Body;
