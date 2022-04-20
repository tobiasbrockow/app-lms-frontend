import React, { useEffect, useState } from "react";
import Navigation from "../Navigation/Navigation";
import Body from "../Body/Body";
import "./Sidebar.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { resizeSidebar } from "./resize";
import Login from "../Login/Login";
import { loginUser, selectUser } from "../../features/user/userSlice";

function Sidebar() {
  const user = useAppSelector(selectUser);
  const [selectedPage, setSelectedPage] = useState(<Login />);

  const dispatch = useAppDispatch();
  useEffect(() => {
    const authenticate = async () => {
      const response = await fetch(
        "https://applmsbe.herokuapp.com/auth/authenticate",
        {
          method: "POST",
          credentials: "include",
        }
      ).then((r) => {
        if (r.status === 200) {
          return r.json();
        } else {
          return undefined;
        }
      });
      if (response != undefined) {
        dispatch(loginUser(response));
      }
    };

    authenticate();
  }, []);

  useEffect(() => {
    if (user.loggedIn) {
      setSelectedPage(<Body />);
    } else {
      setSelectedPage(<Login />);
    }
  }, [user]);

  const resize = (event: React.MouseEvent<HTMLDivElement>) => {
    resizeSidebar(event);
  };

  return (
    <div className="Sidebar" onMouseDown={resize} style={{ width: 580 }}>
      <Navigation />
      {selectedPage}
    </div>
  );
}

export default Sidebar;
