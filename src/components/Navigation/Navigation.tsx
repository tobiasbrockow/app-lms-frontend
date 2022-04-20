import React, { ChangeEventHandler, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import "./Navigation.css";
import {
  changePage,
  selectPage,
  changeEditMode,
  selectView,
  selectEditMode,
} from "../../features/view/viewSlice";
import { logoutUser, selectUser } from "../../features/user/userSlice";

function Navigation() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const editMode = useAppSelector(selectEditMode);

  return (
    <div
      {...(editMode
        ? { className: "app-lms-header-edit" }
        : { className: "app-lms-header" })}
    >
      <div
        {...(editMode ? { id: "app-lms-logo-edit" } : { id: "app-lms-logo" })}
        onClick={() => dispatch(changePage("home"))}
      >
        AppLMS
      </div>
      {user.loggedIn ? <NavigationArea /> : ""}
      {user.loggedIn ? <ProfileArea /> : ""}
    </div>
  );
}

const NavigationArea = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const page = useAppSelector(selectPage);
  const editMode = useAppSelector(selectEditMode);

  return (
    <div className="app-lms-navigation">
      <div
        {...(editMode ? { class: "app-lms-nav-home-edit" } : {})}
        id="app-lms-nav-home"
        onClick={() => dispatch(changePage("home"))}
      >
        Home
      </div>
      {page === "course" || (page === "course-menu" && user.loggedIn) ? (
        <div
          id="app-lms-nav-course-menu"
          {...(editMode ? { class: "app-lms-nav-home-edit" } : {})}
          onClick={() => dispatch(changePage("course-menu"))}
        >
          Course Menu
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

const ProfileArea = () => {
  const user = useAppSelector(selectUser);
  const editMode = useAppSelector(selectEditMode);

  const [profileDropdownActive, setProfileDropdownActive] = useState(false);

  const profileClickHandler = () => {
    profileDropdownActive
      ? setProfileDropdownActive(false)
      : setProfileDropdownActive(true);
  };

  return (
    <div>
      <div className="app-lms-profile-area">
        {editMode ? <div className="app-lms-nav-home-edit">Edit Mode</div> : ""}
        <div id="app-lms-profile" onClick={profileClickHandler}>
          {user
            .user!.name.split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
      </div>
      {profileDropdownActive ? <ProfileDropdown /> : ""}
    </div>
  );
};

const ProfileDropdown = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const view = useAppSelector(selectView);
  const editModeStatus = view.editMode;

  const editModeClickHandler = (e: React.FormEvent<HTMLInputElement>) => {
    dispatch(changeEditMode(e.currentTarget.checked));
  };

  const logout = () => {
    fetch("https://applmsbe.herokuapp.com/auth/logout/", {
      method: "POST",
      credentials: "include",
    });
    dispatch(logoutUser());
  };

  return (
    <div className="app-lms-profile-dropdown">
      <div className="app-lms-profile-dropdown-item">
        <label className="app-lms-switch">
          <input
            type="checkbox"
            onChange={editModeClickHandler}
            checked={editModeStatus}
          />
          <span className="app-lms-slider app-lms-round"></span>
        </label>
        <span>Edit Mode</span>
      </div>
      <div className="app-lms-profile-dropdown-item app-lms-dditem_clickable">
        {user.loggedIn ? <div onClick={logout}>Log out</div> : ""}
      </div>
    </div>
  );
};

export default Navigation;
