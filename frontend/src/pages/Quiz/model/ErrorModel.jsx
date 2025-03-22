import React from "react";
import { AwesomeButton } from "react-awesome-button";
import { useNavigate } from "react-router-dom";

const ErrorModel = () => {

    const navigate = useNavigate();

    const handleBackButtonClick = () => {
        navigate("/");
    };
    

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
      <div className="bg-amber-800 bg-opacity-20 backdrop-blur-lg absolute top-0 left-0 w-full h-full"></div>

      <div className="bg-red-500 w-30 p-8 rounded-3xl shadow-md text-center relative">
        <h2 className="text-4xl text-white font-londrina-solid mb-5">
          Error
        </h2>

        <div className="flex items-center justify-center">
          <div className="bg-yellow-100 shadow-lg rounded-xl w10 pt-10 mb-6 ">
            <p className="font-short-stack m-4 font-bold text-lg mb-12">
                An error occurred while receiving the stream. Please contact support if the issue persists.
            </p>
          </div>
        </div>

        <div>
          <div className="mt-2">
            <AwesomeButton
              type="primary"
              onPress={() => {
                handleBackButtonClick();
              }}
              style={{
                "--button-primary-color": "#ffbc05",
                "--button-primary-color-dark": "#daa000",
                "--button-primary-color-light": "#ffffff",
                "--button-primary-color-hover": "#00cee9",
                "--button-primary-color-active": "#00a5bb",
                "--button-default-border-radius": "10px",
                height: "40px",
                marginRight: "10px",
                width: "250px",
                fontSize: "20px",
                borderStyle: "solid",
                borderRadius: "12px",
                borderColor: "black",
              }}
            >
              Back to Home
            </AwesomeButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModel;
