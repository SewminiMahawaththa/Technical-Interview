import React from "react";
import { useNavigate } from "react-router-dom";
import img from "../../../assets/images/Success/stars.png";
import { AwesomeButton } from "react-awesome-button";

const SuccessQuizModel = ({ quiz, score, attentionPercentage, mock }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };


  const handleNavigateResult = () => {
    navigate("/results");
  };


  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center" style={{ zIndex: 1000 }}>
      <div className="bg-amber-800 bg-opacity-20 backdrop-blur-lg absolute top-0 left-0 w-full h-full"></div>

      <div className="bg-red-500 w-full max-w-2xl p-8 rounded-3xl shadow-md text-center relative">
        <h2 className="text-4xl text-white font-londrina-solid mb-4">
          {quiz}
        </h2>

        <div
          className="flex justify-center absolute items-center"
          style={{ marginTop: "-170px", marginLeft: "170px" }}
        >
          <img src={img} width={280} alt="star image" />
        </div>

        <div className="flex justify-around mt-16">
          <div className="bg-yellow-100 shadow-lg rounded-xl w-100 p-6 mb-6">
            <p className="font-short-stack font-bold text-lg mb-12">
              Your answers are now saved. Great Job. 
            </p>
          </div>
        </div>

        <div className="mt-2">
          <AwesomeButton
            type="primary"
            onReleased={handleNavigate}
            style={{
              "--button-primary-color": "#ffbc05",
              "--button-primary-color-dark": "#daa000",
              "--button-primary-color-light": "#ffffff",
              "--button-primary-color-hover": "#00cee9",
              "--button-primary-color-active": "#00a5bb",
              "--button-default-border-radius": "10px",
              height: "50px",
              marginRight: "10px",
              width: "150px",
              fontSize: "20px",
              borderStyle: "solid",
              borderRadius: "12px",
              borderColor: "black",
              fontFamily: "'Short Stack', cursive",
              fontSize: "18px",
            }}
          >
            Go Home
          </AwesomeButton>
          {!mock ?
          <AwesomeButton
            type="primary"
            onReleased={handleNavigateResult}
            style={{
              "--button-primary-color": "#ffbc05",
              "--button-primary-color-dark": "#daa000",
              "--button-primary-color-light": "#ffffff",
              "--button-primary-color-hover": "#00cee9",
              "--button-primary-color-active": "#00a5bb",
              "--button-default-border-radius": "10px",
              height: "50px",
              marginRight: "10px",
              width: "190px",
              fontSize: "20px",
              borderStyle: "solid",
              borderRadius: "12px",
              borderColor: "black",
              fontFamily: "'Short Stack', cursive",
              fontSize: "18px",
            }}
          >
            Result (Admin)
          </AwesomeButton>
          : ""
        }
        </div>
      </div>
    </div>
  );
};

export default SuccessQuizModel;
