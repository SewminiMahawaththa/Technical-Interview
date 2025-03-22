import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import questions from '../assets/json/questions.json';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase'; 

export function Reports() {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(null);
  const [totalMarks, setTotalMarks] = useState(0);
  const [attentionRate, setAttentionRate] = useState(0);
  const [timeExceeded, setTimeExceeded] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [quizEndTime, setQuizEndTime] = useState(null);
  const [totalTimeTaken, setTotalTimeTaken] = useState(null);

  // Function to calculate marks based on correction rate
  const calculateMarks = (correctionRate) => {
    if (correctionRate >= 80) return 5;
    else if (correctionRate >= 70) return 2.5;
    else if (correctionRate >= 60) return 1.5;
    else if (correctionRate >= 0) return 0;
    else return 0;
  };

  
  const evaluateAnswers = async (quizData) => {
    const evaluatedQuestions = [];
    console.log(quizData.questions);

    for (const question of quizData.questions) {
      const correctAnswer = questions.find(q => q.id === question.questionID)?.CorrectAnswer || "";
      const givenAnswer = question.givenAnswer;

      try {
        const response = await fetch('http://127.0.0.1:5001/similarity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            correct_answer: correctAnswer,
            given_answer: givenAnswer,
          }),
        });

        const data = await response.json();
        const correctionRate = data.similarity_score || 0;
        const marks = calculateMarks(correctionRate);

        evaluatedQuestions.push({
          questionID: question.questionID,
          givenAnswer: givenAnswer,
          correctionRate: correctionRate,
          marks: marks,
        });
      } catch (error) {
        console.error("Error evaluating answer:", error);
        evaluatedQuestions.push({
          questionID: question.questionID,
          givenAnswer: givenAnswer,
          correctionRate: 0,
          marks: 0,
        });
      }
    }

    return evaluatedQuestions;
  };

  // Function to calculate total marks and attention rate
  const calculateResults = (evaluatedQuestions, quizData) => {
    const totalMarks = evaluatedQuestions.reduce((sum, question) => sum + question.marks, 0);
    const attentionRate = quizData.attentionData?.attentionPercentage || 0;

    return { totalMarks, attentionRate };
  };

  // Function to save updated results in local storage and firebase
  const saveResults = async (evaluatedQuestions, totalMarks, attentionRate) => {
    try {
      // Fetch logindata from localStorage (optional)
      const logindata = JSON.parse(localStorage.getItem('logindata')) || {};
      const email = logindata.email || "candidate@example.com";
      const name = logindata.username || "John Doe";
  
      // Create result object
      const result = {
        email,
        name,
        questions: evaluatedQuestions,
        attentionRate,
        finalScore: totalMarks,
        totalTimeTaken,
        techRound: true,
        hrRound: false,
      };
  
      // Store locally
      const storedResults = JSON.parse(localStorage.getItem('CandidateResults')) || [];
      storedResults.push(result);
      localStorage.setItem('CandidateResults', JSON.stringify(storedResults));
  
      // Store in Firestore
      await setDoc(doc(db, 'techRound', email), result);
  
      console.log('Results saved successfully!');
    } catch (error) {
      console.error('Error saving results:', error);
    }
  };

  // Function to calculate total time taken for the quiz
  const calculateTotalTimeTaken = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const timeDiff = end - start;
    return timeDiff / (1000 * 60);
  };

  useEffect(() => {
    const fetchAndEvaluateData = async () => {
      // Retrieve quiz data from local storage
      const storedQuizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
      const latestQuizData = storedQuizzes[storedQuizzes.length - 1];

      if (latestQuizData) {
        // Set quiz start and end time
        setQuizStartTime(latestQuizData.startTime);
        setQuizEndTime(latestQuizData.endTime);

        // Calculate total time taken
        const totalTime = calculateTotalTimeTaken(latestQuizData.startTime, latestQuizData.endTime);
        setTotalTimeTaken(totalTime);

        // Check if time limit exceeded
        if (totalTime > 15) {
          setTimeExceeded(true);
          setTotalMarks(0);
        } else {
          // Evaluate answers using the Flask model
          const evaluatedQuestions = await evaluateAnswers(latestQuizData);

          // Calculate total marks and attention rate
          const { totalMarks, attentionRate } = calculateResults(evaluatedQuestions, latestQuizData);

          // Save updated results in local storage
          saveResults(evaluatedQuestions, totalMarks, attentionRate);

          // Set state to display results
          setReportData({
            questions: evaluatedQuestions,
            totalMarks,
            attentionRate,
          });
          setTotalMarks(totalMarks);
          setAttentionRate(attentionRate);
        }
      }
    };

    fetchAndEvaluateData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-serif p-6" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="bg-[#DBA346] text-white text-center py-8 rounded-t-lg">
          <h1 className="text-5xl font-bold">Results</h1>
        </div>

        {/* Content */}
        <div className="p-6">
          {reportData ? (
            <>
              <h2 className="text-3xl font-bold mb-6">Your Results:</h2>

              {/* Quiz Time Details */}
              <div className="mb-8">
                <p className="text-lg">
                  <strong>Quiz Start Time:</strong> {new Date(quizStartTime).toLocaleString()}
                </p>
                <p className="text-lg">
                  <strong>Quiz End Time:</strong> {new Date(quizEndTime).toLocaleString()}
                </p>
                <p className="text-lg">
                  <strong>Total Time Taken:</strong> {totalTimeTaken.toFixed(2)} minutes
                </p>
              </div>

              {/* Time Limit Exceeded Message */}
              {timeExceeded ? (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                  <p className="font-bold">Reason:</p>
                  <p>Time limit exceeded (15 minutes)</p>
                  <p className="mt-2">
                    <strong>Total Marks:</strong> 0
                  </p>
                </div>
              ) : (
                <>
                  {/* Questions and Answers */}
                  <div className="space-y-6">
                    {reportData.questions.map((question, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-2">Question {index + 1}</h3>
                        <p>
                          <strong>Given Answer:</strong> {question.givenAnswer}
                        </p>
                        <p>
                          <strong>Correction Rate :</strong> {question.correctionRate.toFixed(2)}
                        </p>
                        <p>
                          <strong>Marks:</strong> {question.marks}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Total Marks and Attention Rate */}
                  <div className="mt-8">
                    <p className="text-xl">
                      <strong>Total Marks:</strong> {totalMarks}
                    </p>
                    <p className="text-xl">
                      <strong>Attention Rate:</strong> {attentionRate.toFixed(2)}%
                    </p>
                  </div>
                </>
              )}
            </>
          ) : (
            <h2 className="text-3xl font-bold">Loading Results...</h2>
          )}
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}