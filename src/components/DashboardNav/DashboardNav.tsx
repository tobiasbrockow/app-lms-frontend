import React from "react";
import "./DashboardNav.css";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectCourses } from "../../features/courses/coursesSlice";
import { selectUser } from "../../features/user/userSlice";
import { changeFilter, selectFilter } from "../../features/view/viewSlice";

const DashboardNav = () => {
  const filter = useAppSelector(selectFilter);
  const courses = useAppSelector(selectCourses);
  const user = useAppSelector(selectUser);
  const url = window.location.host;
  const dispatch = useAppDispatch();
  const filterList = [
    { name: "All courses", id: "app-lms-nav-all-courses" },
    { name: "On this page", id: "app-lms-nav-this-page" },
    { name: "In progress", id: "app-lms-nav-progress" },
    { name: "Completed", id: "app-lms-nav-completed" },
  ];

  const countCourses = (filter: string) => {
    switch (filter) {
      case "app-lms-nav-all-courses":
        return courses.length;
      case "app-lms-nav-this-page":
        return courses.filter((c) => c.url === url).length;
      case "app-lms-nav-progress":
        return user.user?.courses.filter((c) => c.completed === false).length;
      case "app-lms-nav-completed":
        return user.user?.courses.filter((c) => c.completed === true).length;
      default:
        return 0;
    }
  };

  return (
    <div className="DashboardNav">
      {filterList.map((f, i) => {
        return (
          <div
            id={f.id}
            key={f.id}
            className={
              f.id === filter
                ? "app-lms-dashboard-nav-item selected-nav-item"
                : "app-lms-dashboard-nav-item"
            }
            onClick={() => dispatch(changeFilter(f.id))}
          >
            {f.name}{" "}
            <span className="app-lms-nav-count-courses">
              {countCourses(f.id)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardNav;
