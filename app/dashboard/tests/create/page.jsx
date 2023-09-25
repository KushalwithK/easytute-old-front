"use client";

import {
  Button,
  Checkbox,
  ConfigProvider,
  DatePicker,
  Input,
  theme,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { BiPlusCircle, BiMinusCircle } from "react-icons/bi";
import React, { useState, useRef } from "react";
import { API_SINGLETON } from "../../../services/API";
import { ToastContainer } from "react-toastify";

const CreateTest = () => {
  const [content, setContent] = useState({});
  const [questions, setQuestions] = useState([]);

  const submitTest = (event) => {
    event.preventDefault();
    const data = { ...content, questions };
    API_SINGLETON.post("/tests", data)
      .then((result) => {
        console.log(result.data);
        setContent({})
        setQuestions([])
        toast("Test added!", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "success",
          theme: "dark",
          position: "bottom-right",
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <>
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <ToastContainer />
        <div className="dark w-full h-full flex items-center justify-center">
          <div className="w-full h-full overflow-auto max-w-md p-8 space-y-3 rounded-xl dark-login-input dark:text-gray-100">
            <h1 className="text-2xl font-bold text-center text-gray-100">
              Create a Test
            </h1>
            <form className="space-y-6" onSubmit={submitTest}>
              <div className="space-y-1 text-sm">
                <label htmlFor="topic" className="block dark:text-gray-400">
                  Topic
                </label>
                <input
                  onChange={(event) =>
                    setContent({ ...content, topic: event.currentTarget.value })
                  }
                  value={content.topic}
                  type="text"
                  name="topic"
                  id="topic"
                  placeholder="Ex. John Smith"
                  className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label htmlFor="passing" className="block dark:text-gray-400">
                  Passing marks
                </label>
                <input
                  onChange={(event) =>
                    setContent({
                      ...content,
                      passingMarks: event.currentTarget.value,
                    })
                  }
                  value={content.passingMarks}
                  type="text"
                  name="passingMarks"
                  id="passing"
                  placeholder="Ex. 25"
                  className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
                />
              </div>
              <div className="space-y-1 text-sm">
                <label htmlFor="total" className="block dark:text-gray-400">
                  Total marks
                </label>
                <input
                  onChange={(event) =>
                    setContent({
                      ...content,
                      totalMarks: event.currentTarget.value,
                    })
                  }
                  value={content.totalMarks}
                  type="text"
                  name="totalMarks"
                  id="total"
                  placeholder="Ex. 100"
                  className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
                />
              </div>

              <div className="text-sm">
                <label
                  htmlFor="question"
                  className="block dark:text-gray-400 mb-2"
                >
                  Questions
                </label>
                {questions.map((question, idx) => (
                  <div className="mb-3" key={idx}>
                    <div className="flex justify-between items-center gap-2">
                      <p>{idx + 1}</p>
                      <Input
                        type="text"
                        name="question"
                        id="question"
                        value={question.question}
                        onChange={(e) => {
                          const changedQuestion = questions.map((ques) => {
                            if (ques == question)
                              return {
                                ...ques,
                                question: e.currentTarget.value,
                              };
                            else return ques;
                          });
                          setQuestions(changedQuestion);
                        }}
                        placeholder="Ex. How to edit this?"
                        className="w-full px-3 py-2 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
                      />
                      <BiMinusCircle
                        onClick={() => {
                          const changedQuestion = questions.filter(
                            (ques) => ques !== question
                          );
                          setQuestions(changedQuestion);
                        }}
                        size={25}
                      />
                    </div>
                    {question.answers.map((answer, idx) => {
                      return (
                        <div
                          className="flex justify-between items-center gap-2 mt-2 mb-2"
                          key={idx}
                        >
                          <Checkbox
                            checked={answer.correct}
                            onClick={(event) => {
                              const changedQuestion = questions.map((ques) => {
                                if (ques == question)
                                  return {
                                    ...ques,
                                    answers: ques.answers.map((ans) => {
                                      if (ans == answer)
                                        return {
                                          ...ans,
                                          correct: event.target.checked,
                                        };
                                      else return ans;
                                    }),
                                  };
                                else return ques;
                              });
                              setQuestions(changedQuestion);
                            }}
                          />
                          <TextArea
                            name="answer"
                            id="answer"
                            rows={1}
                            value={answer.answer}
                            onChange={(e) => {
                              const changedQuestion = questions.map((ques) => {
                                if (ques == question)
                                  return {
                                    ...ques,
                                    answers: ques.answers.map((ans) => {
                                      if (ans == answer)
                                        return {
                                          ...ans,
                                          answer: e.currentTarget.value,
                                        };
                                      else return ans;
                                    }),
                                  };
                                else return ques;
                              });
                              setQuestions(changedQuestion);
                            }}
                            placeholder="Ex. How to edit this?"
                            className="w-full px-3 py-2 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
                          />
                          {idx == question.answers.length - 1 ? (
                            <BiPlusCircle
                              size={30}
                              color="#c2c2c2"
                              onClick={() => {
                                const changedQuestion = questions.map((ques) => {
                                  if (ques == question)
                                    return {
                                      ...ques,
                                      answers: [
                                        ...ques.answers,
                                        { answer: "", correct: false },
                                      ],
                                    };
                                  else return ques;
                                });
                                setQuestions(changedQuestion);
                              }}
                            />
                          ) : (
                            <BiMinusCircle
                              size={30}
                              color="#c2c2c2"
                              onClick={() => {
                                console.log(answer);
                                const changedQuestion = questions.map((ques) => {
                                  if (ques == question)
                                    return {
                                      ...question,
                                      answers: question.answers.filter(
                                        (ans) => ans != answer
                                      ),
                                    };
                                  else return ques;
                                });
                                setQuestions(changedQuestion);
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
                <Button
                  onClick={() =>
                    setQuestions([
                      ...questions,
                      {
                        question: "",
                        answers: [{ answer: "", correct: false }],
                      },
                    ])
                  }
                >
                  {questions.length <= 0
                    ? "Add question"
                    : "Add another question"}
                </Button>
              </div>
              <button
                className="block w-full p-3 text-center rounded-sm dark:text-gray-200 dark:bg-violet-500"
                type="submit"
              >
                Create Test
              </button>
            </form>
          </div>
        </div>
      </ConfigProvider>
    </>
  );
};

export default CreateTest;
