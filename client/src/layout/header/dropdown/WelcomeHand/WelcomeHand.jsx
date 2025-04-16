import React, { useEffect, useState } from "react";

const WelcomeHand = () => {
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.name) {
          setUserName(parsedUser.name);
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  const waveStyle = `
    @keyframes wave-animation {
      0% { transform: rotate(0deg); }
      10% { transform: rotate(14deg); }
      20% { transform: rotate(-8deg); }
      30% { transform: rotate(14deg); }
      40% { transform: rotate(-4deg); }
      50% { transform: rotate(10deg); }
      60% { transform: rotate(0deg); }
      100% { transform: rotate(0deg); }
    }

    .wave {
      display: inline-block;
      animation: wave-animation 2s infinite;
      transform-origin: 70% 70%;
      font-size: 22px;
    }
  `;

  return (
    <>
      <style>{waveStyle}</style>
      <div className="welcome-hand" style={{ fontWeight: 500, fontSize: "16px" }}>
        Welcome {userName} <span className="wave" role="img" aria-label="wave">👋</span>
      </div>
    </>
  );
};

export default WelcomeHand;
