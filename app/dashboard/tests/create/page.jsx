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
import { randomUUID } from "crypto";

const CreateTest = () => {
  const [content, setContent] = useState("");
  const editorRef = useRef(null);
  const [questions, setQuestions] = useState([]);

  return (
    <>
      <div className="dark w-full h-full flex items-center justify-center">
        <div className="w-full h-full overflow-auto max-w-md p-8 space-y-3 rounded-xl dark-login-input dark:text-gray-100">
          <h1 className="text-2xl font-bold text-center text-gray-100">
            Create a Test
          </h1>
          <form className="space-y-6">
            <div className="space-y-1 text-sm">
              <label htmlFor="topic" className="block dark:text-gray-400">
                Topic
              </label>
              <input
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
                type="text"
                name="totalMarks"
                id="total"
                placeholder="Ex. 100"
                className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
              />
            </div>
            <div className="space-y-1 text-sm">
              <label htmlFor="total" className="block dark:text-gray-400 ">
                Test duration
              </label>
              <DatePicker.RangePicker
                size="large"
                showTime={{
                  format: "HH:mm:ss",
                  use12Hours: true,
                }}
                format="YYYY-MM-DD HH:mm:ss"
                onChange={(value, dateString) => {
                  console.log(
                    "Selected Time: ",
                    value[0].toDate().toISOString()
                  );
                  console.log("Formatted Selected Time: ", dateString);
                }}
                onOk={(value) => {
                  console.log("onOk: ", value);
                }}
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
                      defaultValue={question.question}
                      onChange={(e) => {
                        const changedQuestion = questions.map((ques) => {
                          if (ques == question)
                            return {
                              ...ques,
                              question: e.currentTarget.value,
                            };
                          else return ques;
                        });
                        console.log(changedQuestion);
                        setQuestions(changedQuestion);
                      }}
                      placeholder="Ex. How to edit this?"
                      className="w-full mb-2 px-3 py-2 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
                    />
                  </div>
                  {question.answers.map((answer, idx) => {
                    return (
                      <div
                        className="flex justify-between items-center gap-2 mb-2"
                        key={idx}
                      >
                        <Checkbox
                          defaultChecked={answer.correct}
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
                            console.log(changedQuestion);
                            setQuestions(changedQuestion);
                          }}
                        />
                        <TextArea
                          name="answer"
                          id="answer"
                          rows={1}
                          defaultValue={answer.answer}
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
                            console.log(changedQuestion);
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
                              console.log(questions);
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
                              console.log(questions);
                              const changedQuestion = questions.map((ques) => {
                                if (ques == question)
                                  return {
                                    ...question,
                                    answers: question.answers.filter(
                                      (ans) => ans.answer != answer.answer
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
            </div>
            <Button
              type="primary"
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
              {questions.length <= 0 ? "Add question" : "Add another question"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateTest;
