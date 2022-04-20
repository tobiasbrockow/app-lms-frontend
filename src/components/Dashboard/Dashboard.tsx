import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  CourseState,
  fetchCourseAsync,
  selectCourse,
} from "../../features/course/courseSlice";
import {
  addCourseAsync,
  CoursesState,
  deleteCourseAsync,
  selectCourses,
} from "../../features/courses/coursesSlice";
import { selectUser } from "../../features/user/userSlice";
import {
  changePage,
  selectEditMode,
  selectFilter,
} from "../../features/view/viewSlice";
import DashboardNav from "../DashboardNav/DashboardNav";
import "./Dashboard.css";

function Dashboard() {
  const courses = useAppSelector(selectCourses);
  const filter = useAppSelector(selectFilter);
  const user = useAppSelector(selectUser);
  const url = window.location.host;
  const editMode = useAppSelector(selectEditMode);
  const [selectedCourses, setSelectedCourses] = useState<CoursesState>(courses);

  useEffect(() => {
    switch (filter) {
      case "app-lms-nav-all-courses":
        setSelectedCourses(courses);
        break;
      case "app-lms-nav-this-page":
        setSelectedCourses(courses.filter((c) => c.url === url));
        break;
      case "app-lms-nav-progress":
        setSelectedCourses(
          courses.filter((c) => {
            return (
              user.user?.courses.find((uC) => uC.id === c.id)?.completed ===
              false
            );
          })
        );
        break;
      case "app-lms-nav-completed":
        setSelectedCourses(
          courses.filter((c) => {
            return (
              user.user?.courses.find((uC) => uC.id === c.id)?.completed ===
              true
            );
          })
        );
        break;
    }
  }, [filter, courses]);

  return (
    <div className="Dashboard-Body">
      <DashboardNav />
      <div className="Dashboard">
        {selectedCourses.map((c) => {
          return <Course c={c} key={c.id} />;
        })}
        {editMode ? <NewCourse /> : ""}
      </div>
    </div>
  );
}

interface CourseProps {
  c: CourseState;
}

function Course({ c }: CourseProps) {
  const dispatch = useAppDispatch();
  const course = useAppSelector(selectCourse);
  const editMode = useAppSelector(selectEditMode);

  const [cHover, setCHover] = useState(false);
  const handleMouseEnter = () => {
    if (editMode) {
      setCHover(true);
    }
  };
  const handleMouseLeave = () => {
    if (editMode) {
      if (!cOptions) {
        setCHover(false);
      }
    }
  };

  const [cOptions, setCOptions] = useState(false);
  const handleOptionsClick = () => {
    if (editMode) {
      if (!cOptions) {
        setCOptions(true);
      } else {
        setCOptions(false);
      }
    }
  };

  const handleDeleteClick = () => {
    dispatch(deleteCourseAsync(c.id!.toString()));
  };

  return (
    <div
      className="app-lms-course"
      key={c.id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {cHover ? (
        <div
          className="app-lms-course-options-dots"
          onClick={handleOptionsClick}
        ></div>
      ) : (
        ""
      )}
      {cOptions ? (
        <div className="app-lms-course-options-menu">
          <div onClick={handleDeleteClick}>Delete Course</div>
        </div>
      ) : (
        ""
      )}
      <img src={c.img_src} alt={c.title} />
      <div className="app-lms-lower-div">
        <div id="app-lms-course-title">{c.title}</div>
        <div id="app-lms-course-des">{c.des}</div>
        <div
          id="app-lms-course-cta"
          onClick={() => {
            if (c.id != course.id) {
              dispatch(fetchCourseAsync(c.id!.toString()));
            }
            if (c.active) {
              dispatch(changePage("course"));
            } else {
              dispatch(changePage("course-menu"));
            }
          }}
        >
          View course
        </div>
      </div>
    </div>
  );
}

function NewCourse() {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const [clicked, setClicked] = useState(false);
  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");
  const newCourseClickHandler = () => {
    setClicked(true);
  };

  const titleChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const desChangeHandler = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setDes(e.currentTarget.value);
  };

  const saveDraftClickHandler = (e: React.FormEvent<HTMLButtonElement>) => {
    let url = "";
    if (filter === "app-lms-nav-this-page") {
      url = window.location.host;
    }
    dispatch(
      addCourseAsync({
        active: false,
        title: title,
        des: des,
        url: url,
        img_src: "course-picture-1.png",
      })
    );
    setClicked(false);
  };

  if (!clicked) {
    return (
      <div className="app-lms-new-course" onClick={newCourseClickHandler}>
        Add new Course
      </div>
    );
  } else {
    return (
      <div className="app-lms-course">
        <img src="course-picture-1.png" />
        <div className="app-lms-lower-div">
          <input
            id="app-lms-course-title"
            placeholder="Enter course title"
            onChange={titleChangeHandler}
          />
          <textarea
            id="app-lms-course-des"
            placeholder="Enter course description"
            onChange={desChangeHandler}
          />
          <button id="app-lms-new-course-cta" onClick={saveDraftClickHandler}>
            Save Draft
          </button>
        </div>
      </div>
    );
  }
}

export default Dashboard;
