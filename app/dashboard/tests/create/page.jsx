"use client"

import { Button, DatePicker } from 'antd';
import JoditEditor from 'jodit-react';
import React, { useState, useRef } from 'react';

const CreateTest = () => {

    const [questionCount, setQuestionCount] = useState([1])
    const [content, setContent] = useState('')
    const editorRef = useRef(null)

    return (
        <>

            <div className="w-full h-full flex items-center justify-center">
                <div className="w-full h-full overflow-auto max-w-md p-8 space-y-3 rounded-xl dark-login-input dark:text-gray-100">
                    <h1 className="text-2xl font-bold text-center text-gray-100">Create a Test</h1>
                    <form className="space-y-6">
                        <div className="dark space-y-1 text-sm">
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
                        <div className="dark space-y-1 text-sm">
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
                        <div className="dark space-y-1 text-sm">
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
                        <div className="dark space-y-1 text-sm">
                            <label htmlFor="total" className="block dark:text-gray-400 ">
                                Test duration
                            </label>
                            <DatePicker.RangePicker
                                size='large'
                                showTime={{
                                    format: 'HH:mm:ss',
                                    use12Hours: true
                                }}
                                format="YYYY-MM-DD HH:mm:ss"
                                onChange={(value, dateString) => {
                                    console.log('Selected Time: ', value[0].toDate().toISOString());
                                    console.log('Formatted Selected Time: ', dateString);
                                }}
                                onOk={(value) => {
                                    console.log('onOk: ', value);
                                }}
                            />
                        </div>
                        <div className="space-y-1 text-sm">
                            <div className='dark'>
                                <label htmlFor="total" className="block dark:text-gray-400 mb-2">
                                    Questions
                                </label>
                            </div>
                            {
                                questionCount.map((_, index) => {
                                    return <JoditEditor
                                        key={index}
                                        ref={editorRef}
                                        value={content}
                                        tabIndex={1} // tabIndex of textarea
                                        onChange={newContent => console.log(newContent)}
                                    />
                                })
                            }
                        </div>
                        <Button type='primary' onClick={() => setQuestionCount([...questionCount, 1])}>Add another question</Button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateTest