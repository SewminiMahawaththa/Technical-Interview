import React from "react";
import ProductLogo from "../../components/Logo";
import { AwesomeButton } from "react-awesome-button";
import { useNavigate } from "react-router-dom";
import { homeContent } from "../../Content/Text";

function TopBar() {
    const navigate = useNavigate()
  return (
    <div className="p-4 flex justify-between items-center px-16 fixed top-0 w-full z-10">
      {/* Left side: App logo */}
      <div className="flex items-center">
        {/* <img
          src="/path/to/your/logo.png"
          alt="Logo"
          className="w-10 h-10 mr-2"
        /> */}
        <ProductLogo />
      </div>

    </div>
  );
}

export default TopBar;
