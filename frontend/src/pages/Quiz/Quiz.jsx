import React, { useState, useEffect, useRef } from "react";
import TopBar from "../Home/TopBar";
import { useNavigate } from "react-router-dom";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import QuestionCard from './QuestionCard';
import HeaderImg from "../../assets/images/backgrounds/Tech_Img5.jpg";
import Modal from "../../components/Modal";
import ErrorModel from "./model/ErrorModel";
import alertSound from './call-to-attention.mp3';
import AttentionDataBox from "./AttentionDataBox";
import AttentionAlert from "./model/AttentionAlert";
import SuccessQuizModel from "./model/SuccessQuizModel";
import questions from "../../assets/json/questions.json";
import toast, { Toaster } from "react-hot-toast"; 

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [quizSessionId] = useState(1234);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState('');
  const [attentionStatus, setAttentionStatus] = useState("");
  const [notAttentionCount, setNotAttentionCount] = useState(0);
  const [notAttentionCount2, setNotAttentionCount2] = useState(0);
  const [imageData, setImageData] = useState(null);
  const [totalAttentionCount, setTotalAttentionCount] = useState(0);
  const [attentionPercentage, setAttentionPercentage] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const navigate = useNavigate();
  const [showAttentionAlertModal, setShowAttentionAlertModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const eventSourceRef = useRef(null);

  const audioRef = useRef(new Audio(alertSound));
  const videoRef = useRef(null);

  // Filter questions by level
  const beginnerQuestions = questions.filter(q => q.LevelName === "Beginner");
  const intermediateQuestions = questions.filter(q => q.LevelName === "Intermediate");
  const advancedQuestions = questions.filter(q => q.LevelName === "Advanced");
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // Randomly select questions
  const getRandomQuestions = (questions, count) => {
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    const newQuestions = [
      ...getRandomQuestions(beginnerQuestions, 1),
      ...getRandomQuestions(intermediateQuestions, 1),
      ...getRandomQuestions(advancedQuestions, 2),
      ...getRandomQuestions(questions, 1)
    ];
    setSelectedQuestions(newQuestions);
  }, []);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");

        if (videoDevices.length === 0) {
          console.error("No video devices found.");
          setError("No video devices found.");
          toast.error("No video devices found."); // Display error using React Hot Toast
          return;
        }

        let selectedDeviceId = videoDevices[0]?.deviceId;
        for (let device of videoDevices) {
          if (
            !device.label.toLowerCase().includes("virtual") &&
            !device.label.toLowerCase().includes("obs") &&
            !device.label.toLowerCase().includes("microsoft teams") &&
            !device.label.toLowerCase().includes("zoom")
          ) {
            selectedDeviceId = device.deviceId;
            break;
          }
        }

        if (!selectedDeviceId) {
          console.error("No physical webcam found.");
          setError("No physical webcam found.");
          toast.error("No physical webcam found."); // Display error using React Hot Toast
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedDeviceId } },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setError("Could not access the webcam. Please ensure your camera is connected and permissions are granted.");
        toast.error("Could not access the webcam. Please ensure your camera is connected and permissions are granted."); // Display error using React Hot Toast
      }
    };

    startWebcam();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    setStartTime(new Date());
    let errorOccurred = false;

    eventSourceRef.current = new EventSource('http://127.0.0.1:5000/video');

    eventSourceRef.current.onmessage = function(event) {
      if (!errorOccurred) {
        const data = JSON.parse(event.data);
        console.log(data);
        setImageData(`data:image/jpeg;base64,${data.frame}`);
        setAttentionStatus(data.Prediction);
        setTotalAttentionCount(prevCount => prevCount + 1);

        if (data.Prediction === "not_attention" || data.Prediction === "No face detected") {
          setNotAttentionCount(prevCount => prevCount + 1);
          setNotAttentionCount2(prevCount => prevCount + 1)
        } else {
          setNotAttentionCount(0);
        }
      }
    };

    eventSourceRef.current.onerror = function() {
      errorOccurred = true;
      setAttentionStatus("Error");
      console.log("An error occurred while receiving the stream.");
      audioRef.current.pause();
      eventSourceRef.current.close();
    };

    return () => eventSourceRef.current.close();
  }, []);

  useEffect(() => {
    if (notAttentionCount >= 90) {
      audioRef.current.play();
      setShowAttentionAlertModal(true);
    } else {
      setShowAttentionAlertModal(false);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    console.log(notAttentionCount);
  }, [notAttentionCount]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer) {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuestionIndex]: selectedAnswer,
      }));
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer("");
    } else {
      setShowModal(true); 
    }
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    setSelectedAnswer(answers[currentQuestionIndex - 1] || "");
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!selectedAnswer) {
      setShowModal(true);
      return;
    }

    // Save the selected answer for the current question
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: selectedAnswer,
    }));

    setIsSubmitting(true);
  };


  useEffect(() => {
    if (isSubmitting) {
      // Close the event source if it exists
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Prepare the data to be saved in local storage
      const quizData = {
        quizSessionId,
        startTime,
        endTime: new Date(),
        questions: selectedQuestions.map((question, index) => ({
          questionID: question.id, 
          givenAnswer: answers[index] || "", 
        })),
        attentionData: {
          totalAttentionCount,
          notAttentionCount: notAttentionCount2,
          attentionPercentage:
            totalAttentionCount > 0
              ? ((totalAttentionCount - notAttentionCount2) / totalAttentionCount) * 100
              : 0,
        },
      };


      // Save the quiz data in local storage
      const storedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
      storedQuizzes.push(quizData);
      localStorage.setItem("quizzes", JSON.stringify(storedQuizzes));

      // Navigate to the results page
      setShowForm("submit");
      // navigate("/results");

      // Reset submitting state
      setIsSubmitting(false);
    }
  }, [isSubmitting, answers]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const currentQuestionNumber = currentQuestionIndex;

  const closeModal = () => {
    setShowAttentionAlertModal(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setNotAttentionCount(0);
  };

  return (
    <div className="bg-cover bg-center bg-fixed">
      <TopBar />
      <div className="flex justify-center ">
        <Toaster />
        <AttentionDataBox text={attentionStatus} imageUrl={imageData} videoRef={videoRef}/>
        <div>
          <audio id="player" loop>
            <source src={alertSound} type="audio/mp3" />
          </audio>
        </div>

        <div
          className="w-full h-80 relative  bg-stone-100 bg-no-repeat bg-cover bg-contain bg-center"
          style={{ backgroundImage: `url(${HeaderImg})` }}
        >

          <div className="flex justify-center items-center h-full">
            <span className="font-short-stack font-bold text-5xl text-white">Software Engineering Interview</span>
          </div>
        </div>
      </div>

      <div className="bg-sky-100 w-100 h-100 pb-60">
        <div className="flex justify-center items-center pt-5">
          {selectedQuestions.length > 0 && currentQuestionIndex < selectedQuestions.length && (
            <QuestionCard
              questionIndex={currentQuestionNumber}
              question={selectedQuestions[currentQuestionIndex].Question}
              selectedAnswer={selectedAnswer}
              onAnswerSelect={handleAnswerSelect}
            />
          )}
          <div className="navigation-buttons"></div>
        </div>

        <div className="flex justify-center items-center pb-10 ">
          <div className="w-full mr-10 flex justify-end items-center">
            {currentQuestionIndex > 0 && (
              <AwesomeButton
                type="primary"
                onReleased={handlePrevQuestion}
                style={{
                  "--button-primary-color": "#21b8de",
                  "--button-primary-color-dark": "#0494b8",
                  "--button-primary-color-light": "#ffffff",
                  "--button-primary-color-hover": "#12a0c4",
                  "--button-primary-color-active": "#038aab",
                  "--button-default-border-radius": "8px",
                  width: "120px",
                  height: "45px",
                  marginRight: "10px",
                  borderStyle: "solid",
                  borderRadius: "10px",
                  borderColor: "black",
                  fontFamily: "'Short Stack', cursive",
                  fontSize: "18px",
                }}
              >
                Back
              </AwesomeButton>
            )}
            {currentQuestionIndex < selectedQuestions.length - 1 && (
              <AwesomeButton
                type="primary"
                onReleased={handleNextQuestion}
                style={{
                  "--button-primary-color": "#21b8de",
                  "--button-primary-color-dark": "#0494b8",
                  "--button-primary-color-light": "#ffffff",
                  "--button-primary-color-hover": "#12a0c4",
                  "--button-primary-color-active": "#038aab",
                  "--button-default-border-radius": "8px",
                  width: "120px",
                  height: "45px",
                  marginRight: "10px",
                  borderStyle: "solid",
                  borderRadius: "10px",
                  borderColor: "black",
                  fontFamily: "'Short Stack', cursive",
                  fontSize: "18px",
                }}
              >
                Next
              </AwesomeButton>
            )}
            {currentQuestionIndex === selectedQuestions.length - 1 && (
              <AwesomeButton
                type="primary"
                onReleased={handleSubmit}
                style={{
                  "--button-primary-color": "#deac21",
                  "--button-primary-color-dark": "#997000",
                  "--button-primary-color-light": "#ffffff",
                  "--button-primary-color-hover": "#af8718",
                  "--button-primary-color-active": "#a07b17",
                  "--button-default-border-radius": "8px",
                  width: "120px",
                  height: "45px",
                  marginRight: "10px",
                  borderStyle: "solid",
                  borderRadius: "10px",
                  borderColor: "black",
                  fontFamily: "'Short Stack', cursive",
                  fontSize: "18px",
                }}
              >
                Submit
              </AwesomeButton>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        message="Hey you need to answer everything to go to the next :)"
        onClose={handleCloseModal}
      />
      {showAttentionAlertModal &&  <AttentionAlert quiz="Quiz" closeModal={closeModal}/>}
      {showForm === "submit" && <SuccessQuizModel quiz={"Quiz"} score={totalScore} attentionPercentage={attentionPercentage} mock={false}/>}
      {showErrorModal && <ErrorModel/>}
    </div>
  );
};

export default Quiz;