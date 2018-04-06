export interface Questions {
    question_id: string;
    test_id: string;
    question_text: string;
    level: string;
    type: string;
    attachment: string;

}


export interface QuestionsGet {
    question_id: string;
    test_id: string;
    question_text: string;
    level: string;
    type: string;
    attachment: string;
}

export interface QuestionsAdd {
    question_id: string;
    test_id: string;
    question_text: string;
    level: string;
    type: string;
    attachment: string;
}

export interface TestNameByID {
    test_id: string;
    test_name: string;
    subject_id: string;
    faculty_id: string;

//    Test: {test_id, test_name, subject_id, tasks, time_for_test, enabled, attempts}
//    TestDetail: {id, test_id, level, tasks, rate}
}

export interface IResponse {
    response: string;
}
