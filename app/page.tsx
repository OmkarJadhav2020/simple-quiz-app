"use client";
import React, { useState, useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface AnswerFeedback {
  question: string;
  correctAnswer: string;
}

interface ChartData {
  id: string;
  label: string;
  value: number;
  color: string;
}

const Home: React.FC = () => {
  const [time, setTime] = useState<number>(59);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: string }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState<AnswerFeedback[]>([]);

  // Fetch Questions
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch("https://opentdb.com/api.php?amount=5&category=9&type=multiple");
        const data = await response.json();
        setQuestions(data.results);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
    fetchQuestions();
  }, []);

  // Timer Logic
  useEffect(() => {
    if (time > 0) {
      const timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      validateAnswers();
    }
  }, [time]);

  // Dark Mode Toggle Logic
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Validate Answers
  const validateAnswers = () => {
    let score = 0;
    const correct: AnswerFeedback[] = [];
    questions.forEach((question, index) => {
      if (selectedOptions[index] === question.correct_answer) {
        score += 1;
      } else {
        correct.push({
          question: question.question,
          correctAnswer: question.correct_answer,
        });
      }
    });
    setScore(score);
    setCorrectAnswers(correct);
  };

  // Handle Option Selection
  const handleOptionSelect = (questionIndex: number, option: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  // Move to the next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  // Move to the previous question
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Chart data for correct and incorrect answers
  const chartData: ChartData[] = [
    {
      id: "Correct",
      label: "Correct",
      value: score ?? 0,
      color: "hsl(120, 70%, 50%)",
    },
    {
      id: "Incorrect",
      label: "Incorrect",
      value: questions.length - (score ?? 0),
      color: "hsl(0, 70%, 50%)",
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <header className="px-5 py-3 bg-black dark:bg-gray-800 text-white dark:text-gray-200">
        <nav className="flex justify-between items-center">
          <span className="text-3xl">Quiz20</span>
          <span className="text-3xl rounded-full px-4 py-1 font-semibold dark:bg-gray-900 bg-gray-200 text-black dark:text-white">
            00:{time < 10 ? `0${time}` : time}
          </span>
          <button onClick={() => setDarkMode(!darkMode)} className="px-2 py-1 rounded-full flex items-center justify-center bg-black dark:bg-gray-900">
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            )}
          </button>
        </nav>
      </header>

      <main className="p-5">
        {score === null ? (
          // Quiz in progress
          <div>
            <h2 className="text-2xl font-bold mb-3">Question {currentQuestionIndex + 1} of {questions.length}</h2>
            {questions.length > 0 && (
              <div className="mb-4">
                <h2 className="font-semibold">{questions[currentQuestionIndex].question}</h2>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {["A", "B", "C", "D"].map((label, optionIndex) => {
                    const option = [...questions[currentQuestionIndex].incorrect_answers, questions[currentQuestionIndex].correct_answer].sort()[optionIndex];
                    return (
                      <button
                        key={optionIndex}
                        className={`py-2 px-4 rounded-lg font-semibold ${selectedOptions[currentQuestionIndex] === option ? "bg-blue-500 text-white" : "bg-gray-300 dark:bg-gray-600 text-black dark:text-white"}`}
                        onClick={() => handleOptionSelect(currentQuestionIndex, option)}
                      >
                        {label}. {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="flex justify-between mt-5">
              <button onClick={prevQuestion} disabled={currentQuestionIndex === 0} className="bg-gray-500 text-white py-2 px-4 rounded-lg disabled:opacity-50">Previous</button>
              <button onClick={nextQuestion} disabled={currentQuestionIndex === questions.length - 1} className="bg-blue-500 text-white py-2 px-4 rounded-lg">Next</button>
            </div>
          </div>
        ) : (
          // Quiz results
          <div className="text-center">
            <h2 className="text-2xl font-bold">Quiz Complete!</h2>
            <p className="text-lg mt-2">Your Score: {score} / {questions.length}</p>
            <div className="w-full h-64 mt-6">
              <ResponsivePie
                data={chartData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.6}
                padAngle={0.7}
                cornerRadius={5}
                colors={{ datum: "data.color" }}
                borderWidth={2}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                enableArcLinkLabels={false}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
              />
            </div>
            <h3 className="text-xl font-semibold mt-4">Detailed Feedback</h3>
            {correctAnswers.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {correctAnswers.map((item, index) => (
                  <li key={index} className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
                    <p className="text-red-600 font-bold">Question: {item.question}</p>
                    <p className="text-green-600">Correct Answer: {item.correctAnswer}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-green-600 mt-4">Perfect score! All answers correct.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
