"use client";

import React, { useEffect, useState } from "react";
import { API_SINGLETON } from "../../../../services/API";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button, Checkbox, ConfigProvider, theme } from "antd";
import { ToastContainer, toast } from "react-toastify";

const AttendTest = ({ params }) => {
  const [test, setTest] = useState(null);
  const router = useRouter();

  const fetchTest = () => {
    if (params.id) {
      API_SINGLETON.get(`/tests/${params.id}`).then((result) => {
        const test = result.data.test;

        const changedTest = {
          ...test,
          testDetail: {
            ...test.testDetail,
            questions: test.testDetail.questions.map((question) => {
              question.answers = question.answers.map((answer) => {
                return {
                  _id: answer._id,
                  answer: answer.answer,
                  selectedAnswer: false,
                };
              });
              return question;
            }),
          },
        };
        console.log(changedTest);
        setTest(changedTest);
      });
    } else {
      router.back();
    }
  };

  const handleTestAttended = () => {
    API_SINGLETON.put(`/tests/${params.id}/finish/test`, {
      studentId: Cookies.get("userId"),
      ...test,
    })
      .then((_) => {
        toast("Test Completed!", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "success",
          theme: "dark",
          position: "bottom-right",
        });
        router.push("/dashboard/tests/results");
      })
      .catch((error) => {
        toast(error.message, {
          hideProgressBar: true,
          autoClose: 2000,
          type: "error",
          theme: "dark",
          position: "bottom-right",
        });
      });
  };

  useEffect(() => {
    fetchTest();
  }, []);

  return (
    <>
      <ToastContainer />
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <div className="dark h-full w-full flex items-center justify-center">
          <div className="w-full h-full overflow-auto max-w-md p-8 space-y-3 rounded-xl dark-login-input dark:text-gray-100">
            <h1 className="text-center">
              Attend the test of {test?.testDetail.topic}
            </h1>
            {test && (
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-1 text-sm">
                  <label htmlFor="topic" className="block dark:text-gray-400">
                    Topic
                  </label>
                  <p className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400">
                    {test.testDetail.topic}
                  </p>
                </div>
                <div className="space-y-1 text-sm">
                  <label htmlFor="topic" className="block dark:text-gray-400">
                    Minumum / Maximum Marks
                  </label>
                  <p className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400">
                    {test.testDetail.passingMarks} /{" "}
                    {test.testDetail.totalMarks}
                  </p>
                </div>
                <div className="space-y-1 text-sm">
                  <label htmlFor="topic" className="block dark:text-gray-400">
                    Questions
                  </label>
                  <div className="w-full px-4 py-1 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400">
                    {test.testDetail.questions.map((question) => {
                      return (
                        <div
                          className="bg-stone-900 rounded-md px-4 py-3 my-3"
                          key={question._id}
                        >
                          <h1 className="mb-3 text-base">
                            {question.question}
                          </h1>
                          <div className="flex flex-col gap-2">
                            {question.answers.map((answer) => {
                              return (
                                <Checkbox
                                  key={answer._id}
                                  onChange={(e) => {
                                    let changedAnswers = [];
                                    if (e.target.checked) {
                                      changedAnswers = question.answers.map(
                                        (ans) => {
                                          if (ans == answer) {
                                            return {
                                              ...ans,
                                              selectedAnswer: true,
                                            };
                                          } else {
                                            return ans;
                                          }
                                        }
                                      );
                                    } else {
                                      changedAnswers = question.answers.map(
                                        (ans) => {
                                          if (ans == answer) {
                                            return {
                                              ...ans,
                                              selectedAnswer: false,
                                            };
                                          } else {
                                            return ans;
                                          }
                                        }
                                      );
                                    }
                                    setTest((oldTest) => {
                                      return {
                                        ...oldTest,
                                        testDetail: {
                                          ...oldTest.testDetail,
                                          questions:
                                            oldTest.testDetail.questions.map(
                                              (qs) => {
                                                if (qs == question) {
                                                  return {
                                                    ...question,
                                                    answers: changedAnswers,
                                                  };
                                                } else {
                                                  return qs;
                                                }
                                              }
                                            ),
                                        },
                                      };
                                    });
                                  }}
                                >
                                  {answer.answer}
                                </Checkbox>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <Button
                    className="w-full"
                    size="large"
                    onClick={handleTestAttended}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </ConfigProvider>
    </>
  );
};

export default AttendTest;
