"use client";
import React, { useState, useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";
import { MdGTranslate } from "react-icons/md";
import { FaChartColumn } from "react-icons/fa6";
import { CiShare2 } from "react-icons/ci";
import { MdOutlineReportProblem } from "react-icons/md";
import ReportModal from "./components/ReportModal";
import { FaEye } from "react-icons/fa";

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
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: string;
  }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number | null>(null);
  // const [correctAnswers, setCorrectAnswers] = useState<AnswerFeedback[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Questions
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch(
          "https://opentdb.com/api.php?amount=5&category=9&type=multiple"
        );
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
    setTime(0);
    let score = 0;
    const correct: AnswerFeedback[] = [];
    let correctCount = 0;
    let incorrectCount = 0;
    let notAttemptedCount = 0;

    questions.forEach((question, index) => {
      const selectedOption = selectedOptions[index];
      if (selectedOption === question.correct_answer) {
        score += 1;
        correctCount += 1;
      } else if (selectedOption) {
        score -= 0.33;
        incorrectCount += 1;
        correct.push({
          question: question.question,
          correctAnswer: question.correct_answer,
        });
      } else {
        notAttemptedCount += 1;
      }
    });

    setScore(score);
    // setCorrectAnswers(correct);

    // Set chart data based on correct, incorrect, and not attempted counts
    setChartData([
      {
        id: "Correct",
        label: "Correct",
        value: correctCount,
        color: "hsl(90, 34%, 63%)",
      },
      {
        id: "Incorrect",
        label: "Incorrect",
        value: incorrectCount,
        color: "hsl(4, 82%, 67%)",
      },
      {
        id: "Not Attempted",
        label: "Not Attempted",
        value: notAttemptedCount,
        color: "hsl(0, 0%, 85%)",
      },
    ]);
  };



  // Chart data for correct, incorrect, and not attempted answers
  const [chartData, setChartData] = useState<ChartData[]>([
    { id: "Correct", label: "Correct", value: 0, color: "hsl(90, 34%, 63%)" },
    {
      id: "Incorrect",
      label: "Incorrect",
      value: 0,
      color: "hsl(4, 82%, 67%)",
    },
    {
      id: "Not Attempted",
      label: "Not Attempted",
      value: 0,
      color: "hsl(0, 3%, 26%)",
    },
  ]);

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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <header className="px-5 py-3 bg-black dark:bg-gray-800 text-white dark:text-gray-200">
        <nav className="flex justify-between items-center">
          <span className="text-3xl">Quiz20</span>
          <span className="text-3xl rounded-full px-4 py-1 font-semibold dark:bg-gray-900 bg-gray-200 text-black dark:text-white">
            00:{time < 10 ? `0${time}` : time}
          </span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-2 py-1 rounded-full flex items-center justify-center bg-black dark:bg-gray-900"
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                />
              </svg>
            )}
          </button>
        </nav>
      </header>

      <main className="p-5">
        {score === null ? (
          // Quiz in progress
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold mb-3">Quiz by Quiz</h2>
              <button
                className="bg-blue-500 text-white w-4/12 px-2 py-2 rounded-3xl"
                onClick={validateAnswers}
              >
                Submit
              </button>
            </div>

            <div className="flex items-center gap-2">
              {[...Array(questions.length)].map((_, index) => (
                <div
                  key={index}
                  className={`flex items-center relative justify-center w-9 h-9 mb-8 rounded-full cursor-pointer ${
                    index === currentQuestionIndex
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                  <span className="absolute bottom-[-25]">{index + 1}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-3 items-center">
              <h2 className="text-base font-semibold text-blue-400 mb-3">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h2>
              <div className="flex gap-4 text-3xl text-gray-500">
                <button>
                  <CiShare2 />
                </button>
                <button >
                  <MdGTranslate />
                </button>
                <button onClick={openModal}>
                  <MdOutlineReportProblem />
                </button>
                <ReportModal isOpen={isModalOpen} onClose={closeModal} />
              </div>
            </div>

            {questions.length > 0 && (
              <div className="mb-4">
                <h2 className="font-semibold">
                  {questions[currentQuestionIndex].question}
                </h2>
                <div className="grid grid-rows-4 gap-4 mt-4 items-start">
                  {["A", "B", "C", "D"].map((label, optionIndex) => {
                    const option = [
                      ...questions[currentQuestionIndex].incorrect_answers,
                      questions[currentQuestionIndex].correct_answer,
                    ].sort()[optionIndex];
                    return (
                      <button
                        key={optionIndex}
                        className={`flex items-center gap-5 py-2 px-4 rounded-lg  ${
                          selectedOptions[currentQuestionIndex] === option
                            ? "border-4 border-blue-400 "
                            : "bg-gray-100 dark:bg-gray-600 text-black dark:text-white"
                        }`}
                        onClick={() =>
                          handleOptionSelect(currentQuestionIndex, option)
                        }
                      >
                        <div
                          className={`rounded-3xl p-2 px-4 font-bold text-white  ${
                            selectedOptions[currentQuestionIndex] === option
                              ? "bg-blue-400"
                              : "bg-gray-500"
                          }`}
                        >
                          {label}
                        </div>{" "}
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="fixed bottom-0 w-full mb-5 gap-4 grid grid-cols-2 justify-between mt-5">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className="bg-gray-500 text-white py-4 px-4 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={nextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="bg-black text-white py-4 px-4 rounded-lg"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          // Quiz results
          <div className="text-center">
            <h2 className="text-2xl font-bold">Quiz Complete!</h2>
            <p className="text-lg mt-2">
              Your Score: {score} / {questions.length}
            </p>
            <div className="w-full h-[350px] mt-6">
              <ResponsivePie
                data={chartData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.8}
                padAngle={0.7}
                cornerRadius={0}
                colors={{ datum: "data.color" }}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                enableArcLinkLabels={false}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                  from: "color",
                  modifiers: [["darker", 2]],
                }}
              />
            </div>
            <h3 className="text-sm mt-4">
              <div className="flex justify-center items-center gap-2">
                <span className="flex justify-between items-center gap-2">
                  <div className="w-3 h-3 rounded-lg bg-green-500"></div>{" "}
                  Correct
                </span>
                <span className="flex justify-between items-center gap-2">
                  <div className="w-3 h-3 rounded-lg bg-red-500"></div>{" "}
                  Incorrect
                </span>
                <span className="flex justify-between items-center gap-2">
                  <div className="w-3 h-3 rounded-lg bg-gray-400"></div> Not
                  attempted
                </span>
              </div>
            </h3>

            <div className="flex justify-around items-center mt-4 mb-10">
              <div className="flex flex-col">
                <span>Positive</span>
                <span>{chartData[0]["value"]}</span>
              </div>
              <div className="flex flex-col">
                <span>Negative</span>
                <span>{chartData[1]["value"] * -0.33}</span>
              </div>
              <div className="flex flex-col">
                <span>Total</span>
                <span>{score}</span>
              </div>
            </div>

            <div className="relative bottom-0 left-0 flex gap-2 flex-col w-full ">
              <div className="flex justify-around bg-red-500 rounded-xl text-white p-5 m-2 items-center w-full">
                <span>LEADERBOARD</span>
                <span>
                  <FaChartColumn />
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-around items-center bg-black text-white p-5 m-2 rounded-lg">
                  <span className="text-2xl">
                    <CiShare2 />
                  </span>
                  <span>Share</span>
                </div>
                <div className="flex justify-around items-center bg-black text-white p-5 m-2 rounded-lg">
                  <span className="text-2xl">
                    <FaEye />
                  </span>
                  <span>Answer</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
