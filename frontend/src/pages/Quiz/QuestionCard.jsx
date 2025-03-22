import React from 'react';

const QuestionCard = ({ questionIndex, question, selectedAnswer, onAnswerSelect }) => {
  const questionNumber = questionIndex + 1;

  return (
    <div className={`bg-white py-10 font-short-stack p-6 rounded-3xl shadow-md mb-12`} style={{ minWidth:"80rem"}}>
      <div className="mb-4">
        <label className="block text-xl font-semibold mb-2">
          {questionNumber}. {question}
        </label>
        <div className="flex flex-col space-x-8 mt-6">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg"
            rows="4"
            placeholder="Type your answer here..."
            value={selectedAnswer}
            onChange={(e) => onAnswerSelect(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;