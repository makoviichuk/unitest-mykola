import {Component, Inject, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {QuestionsService} from '../questions.service';
// import {QuestionsComponent} from '../questions.component';
import {IQuestions, IQuestionSet, IAnswerSet, IAnswerGet, IResponse, IQuestionGet} from '../questions-interface';
import {ActivatedRoute} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';


@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss'],
  providers: [ QuestionsService ]
})
export class AddQuestionComponent implements OnInit {


 form;
 correctAnswerInputType = 'radio';
 answerResourse = 'text';
 answerNumber = [];
//  correctAnswers = [];
 newAnswersArray = [];


 questionForm = new FormGroup ({
    // question_text: new FormControl('', Validators.required),
    // level: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^([1-9]|1[0-9]|20)$/)])),
    // type: new FormControl('1', Validators.required),
    // '0': new FormControl('', Validators.required)
  });


 selTestId: string;
 selTestName: string;

 new_question: IQuestionSet = {
    test_id: this.selTestId,
    question_text: 'no text',
    level: '1',
    type: '1',
    type_name: '',
    attachment: ''
};

new_answer: IAnswerSet = {
  question_id: '',
  true_answer: '0',
  answer_text: '',
  attachment: '',
};

constructor(
  private questionService: QuestionsService,
  private matDialogRef: MatDialogRef<AddQuestionComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {

    this.selTestId = this.data.sel_TestId;
    this.selTestName = this.data.sel_TestName;

    console.log('selTestId = ', this.selTestId, ', selTestName = ', this.selTestName);

    console.log('answerNumber = ', this.answerNumber);
    console.log('newAnswersArray = ', this.newAnswersArray);

    this.form = new FormGroup({
      'title': new FormControl(null, [Validators.required]),
      'description': new FormControl(null, [Validators.required])
    });

  }


  addAnswer() {
    if (this.correctAnswerInputType === 'num' ) {
         this.answerNumber = ['1', '2'];
         this.newAnswersArray = [{}, {}];
         this.newAnswersArray.forEach(element => {  element.true_answer = '1'; });

         this.questionForm.addControl(  (this.newAnswersArray.length).toString() ,
                                          new FormControl('', [Validators.required] )
                                     );
    } else {

      this.questionForm.addControl(  (this.answerNumber.length + 1).toString() ,
                                      new FormControl('', [Validators.required] ) );
                  this.answerNumber.push( (this.answerNumber.length + 1).toString());
                  this.newAnswersArray.push({});

                  if (this.correctAnswerInputType === 'txt' ) { // set added answer correct
                    this.newAnswersArray[this.newAnswersArray.length - 1].true_answer = '1'; }

                  if (this.answerResourse === 'text' ) { // set added answer correct
                    this.newAnswersArray[this.newAnswersArray.length - 1].attachment = ''; }

                  if (this.answerResourse === 'file' ) { // set added answer correct
                    this.newAnswersArray[this.newAnswersArray.length - 1].answer_text = ''; }

    }
                console.log('this.answerNumber = ', this.answerNumber);
                console.log('this.newAnswersArray = ', this.newAnswersArray);
  }


  onAnswerTypeSelect(event) {
    console.log('onAnswerTypeSelect = ', event.target.value);
    if (event.target.value === '1') {
       this.correctAnswerInputType = 'radio';
       this.newAnswersArray.forEach(element => { element.true_answer = '0'; }); // clears all correct answers
       }
    if (event.target.value === '2') {
        this.correctAnswerInputType = 'checkbox';
        this.newAnswersArray.forEach(element => { element.true_answer = '0'; }); // clears all correct answers
       }
    if (event.target.value === '3') {
        this.correctAnswerInputType = 'txt';
        this.newAnswersArray.forEach(element => { element.true_answer = '1'; }); // set all answers correct
      }
    if (event.target.value === '4') {
        this.correctAnswerInputType = 'num';
        this.addAnswer(); // sets two input fields for NUMERICAL type
    }
    console.log('correctAnswerInputType = ', this.correctAnswerInputType);
    console.log(' this.newAnswersArray = ',  this.newAnswersArray);
  }


  onAnswerResourseSelect(event) {
    console.log('onAnswerResourseSelect = ', event.target.value);
    if (event.target.value === '1') {
       this.answerResourse = 'text';
       this.newAnswersArray.forEach(element => { element.attachment = ''; }); // clears all attachments
       }

    if (event.target.value === '2') {
       this.answerResourse = 'file';
       this.newAnswersArray.forEach(element => { element.answer_text = ''; }); // clears all answers text
       }
    if (event.target.value === '3') { this.answerResourse = 'text_file'; }
    console.log('this.answerResourse = ', this.answerResourse);
    console.log(' this.newAnswersArray = ',  this.newAnswersArray);
  }


  setQuestionType(elem: HTMLSelectElement) {
    const value = elem.options[elem.selectedIndex].value;
    const index = elem.options[elem.selectedIndex].index; // + 1; // починаємо нумерацію з одиниці
    this.new_question.type_name = value;
    this.new_question.type = '' + index;
    console.log('type_index = ', index, ' type_name = ', value);
  }

  setQuestionLevel(elem: HTMLSelectElement) {
    const value = elem.options[elem.selectedIndex].value;
    this.new_question.level = value;
    console.log('level = ', value);
  }

  setQuestionText(elem: HTMLSelectElement) {
    const value = elem.value;
    this.new_question.question_text = value;
    console.log('QuestionText = ', value);
  }

  setQuestionAttachment(event) {
    const fileReader = new FileReader();
    const img = event.target.files[0];
    fileReader.onload = () => this.new_question.attachment = fileReader.result;
    fileReader.readAsDataURL(img);
  }

  setAnsverAttachment(number, event) {
    const checkedIndex = Number(number) - 1;
    const fileReader = new FileReader();
    const img = event.target.files[0];
    fileReader.onload = () => this.newAnswersArray[checkedIndex].attachment = fileReader.result;
    fileReader.readAsDataURL(img);
    console.log('this.newAnswersArray = ', this.newAnswersArray);
  }

  setAnsverText(number, event) {
    const checkedIndex = Number(number) - 1;
    const value = event.target.value;
    this.newAnswersArray[checkedIndex].answer_text = value;
    console.log('this.newAnswersArray = ', this.newAnswersArray);
  }


  setAnswerCorrect(number, event) {
    // console.log('number = ', number, ',  event.target.value = ', event.target.value);
    const checkedIndex = Number(number) - 1;

    if (this.correctAnswerInputType === 'radio') {
      for (let index = 0; index < this.newAnswersArray.length; index++) {
        this.newAnswersArray[index].true_answer = (index === checkedIndex) ? '1' : '0';
      }
    }

    if (this.correctAnswerInputType === 'checkbox') {
      this.newAnswersArray[checkedIndex].true_answer =
      ( this.newAnswersArray[checkedIndex].true_answer === '0') ? '1' : '0';
    }

    console.log(`this.newAnswersArray = `, this.newAnswersArray);
  }


addQuestionSubmit() {
  const questionJSON = JSON.stringify({
    test_id: this.selTestId,
    question_text: this.new_question.question_text,
    level: this.new_question.level,
    type: this.new_question.type,
    attachment: this.new_question.attachment
  });

    this.questionService.addQuestion(questionJSON).subscribe((dataNewQuestions: IQuestionGet) => {
      if (dataNewQuestions) {

        console.log('dataNewQuestions = ', dataNewQuestions);

          this.newAnswersArray.forEach(answer => {
              answer.question_id = dataNewQuestions[0].question_id;
              console.log('new answer = ', answer);
              this.questionService.addAnswer(answer).subscribe(
                   (dataNewAnswers: IAnswerGet) =>
                    console.log('Respond: newAnswers_id = ', dataNewAnswers)
              );
              });

        this.matDialogRef.close();
      }
    });

}


  closeDialog() {
    this.matDialogRef.close();
  }

}
