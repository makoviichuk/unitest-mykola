export interface IQuestions {
    question_id: string;
    test_id: string;
    question_text: string;
    level: string;
    type: string;
    attachment: string;
    test: string;
}


export interface IQuestionGet {
    question_id: string;
    test_id: string;
    question_text: string;
    level: string;
    type: string;
    attachment: string;
}

export interface IQuestionSet {
    test_id: string;
    question_text: string;
    level: string;
    type: string;
    type_name: string;
    attachment: string;
}


export interface ITestsGet {
    test_id: string;
    test_name: string;
    subject_id: string;
    tasks: string;
    time_for_test: string;
    enabled: string;
    attempts: string;
}

export interface ITestNameByID { // адаптувати відповідно до сутності Question
    test_id: string;
    test_name: string;
    subject_id: string;
    faculty_id: string;

//    TestDetail: {id, test_id, level, tasks, rate}
}

export interface IResponse {
    response: string;
}
