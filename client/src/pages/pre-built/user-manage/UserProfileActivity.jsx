import React, { useState, useEffect } from "react";
import Content from "@/layout/content/Content";
import { Card} from "reactstrap";
import Head from "@/layout/head/Head";
import {
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  LoginLogTable,
  Button,
} from "@/components/Component";

import UserProfileAside from "./UserProfileAside";

const UserProfileActivityPage = () => {
  const [sm, updateSm] = useState(false);
  const [mobileView , setMobileView] = useState(false);
  const [loginLogs, setLoginLogs] = useState([]);
  const [loading, setLoading] = useState(true);

    // ✅ Retrieve logged-in user ID
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const loggedInCustomerId = user?.id || null;
  
    // ✅ Fetch login activity dynamically
    const fetchLoginActivity = async () => {
      try {
        setLoading(true);
        if (!loggedInCustomerId) {
          console.error("No logged-in customer ID found");
          setLoading(false);
          return;
        }
  
        const response = await fetch(`http://localhost:3000/api/login-activity/${loggedInCustomerId}`);
        if (!response.ok) throw new Error("Failed to fetch login activity");
  
        const logs = await response.json();
        setLoginLogs(logs.slice(0, 20)); // ✅ Show only the last 20 login records
        setLoading(false);
      } catch (error) {
        console.error("Error fetching login activity:", error.message);
        setLoginLogs([]);
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchLoginActivity();
  
      // ✅ Handle mobile view logic
      const viewChange = () => {
        if (window.innerWidth < 990) {
          setMobileView(true);
        } else {
          setMobileView(false);
          updateSm(false);
        }
      };
  
      viewChange();
      window.addEventListener("load", viewChange);
      window.addEventListener("resize", viewChange);
      document.getElementsByClassName("nk-header")[0]?.addEventListener("click", function () {
        updateSm(false);
      });
  
      return () => {
        window.removeEventListener("resize", viewChange);
        window.removeEventListener("load", viewChange);
      };
    }, [loggedInCustomerId]);
  
  return (
    <React.Fragment>
      <Head title="User List - Profile"></Head>
      <Content>
        <Card className="card-bordered">
          <div className="card-aside-wrap">
            <div
              className={`card-aside card-aside-left user-aside toggle-slide toggle-slide-left toggle-break-lg ${
                sm ? "content-active" : ""
              }`}
            >
              <UserProfileAside updateSm={updateSm}  sm={sm} />
            </div>
            <div className="card-inner card-inner-lg">
              {sm && mobileView && <div className="toggle-overlay" onClick={() => updateSm(!sm)}></div>}
              <BlockHead size="lg">
                <BlockBetween>
                  <BlockHeadContent>
                    <BlockTitle tag="h4">Login Activity</BlockTitle>
                    <BlockDes>
                      <p>
                        Here is your last 20 login activities log.{" "}
                        <span className="text-soft">
                          <Icon name="info" />
                        </span>
                      </p>
                    </BlockDes>
                  </BlockHeadContent>
                  <BlockHeadContent className="align-self-start d-lg-none">
                    <Button
                      className={`toggle btn btn-icon btn-trigger mt-n1 ${sm ? "active" : ""}`}
                      onClick={() => updateSm(!sm)}
                    >
                      <Icon name="menu-alt-r"></Icon>
                    </Button>
                  </BlockHeadContent>
                </BlockBetween>
              </BlockHead>
               {/* ✅ Show loading state if data is not yet available */}
               {loading ? (
                <p>Loading login activity...</p>
              ) : loginLogs.length > 0 ? (
                <Table bordered>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Login Time</th>
                      <th>IP Address</th>
                      <th>Device Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginLogs.map((log, index) => (
                      <tr key={log._id}>
                        <td>{index + 1}</td>
                        <td>{new Date(log.loginTime).toLocaleString()}</td>
                        <td>{log.ipAddress || "Unknown"}</td>
                        <td>{log.deviceInfo || "Unknown"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No login activity found.</p>
              )}
            </div>
          </div>
        </Card>
      </Content>
    </React.Fragment>
  );
};

export default UserProfileActivityPage;