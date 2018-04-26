import {Component, Inject, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {QuestionsService} from '../questions.service';
// import {QuestionsComponent} from '../questions.component';
import {IQuestions, IQuestionSet, IAnswerSet, IResponse} from '../questions-interface';
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
//  attachment = '';
 correctAnswerInputType = 'radio';
 answerResourse = 'text';
 answerNumber = ['1'];
 correctAnswers = [];
 questionForm = new FormGroup ({
    question_text: new FormControl('', Validators.required),
    level: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^([1-9]|1[0-9]|20)$/)])),
    type: new FormControl('1', Validators.required),
    '0': new FormControl('', Validators.required)
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
  true_answer: '',
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

    console.log('selTestId = ', this.data.selId);
    console.log('selTestName = ', this.selTestName);

    console.log('answerNumber = ', this.answerNumber);

    this.form = new FormGroup({
      'title': new FormControl(null, [Validators.required]),
      'description': new FormControl(null, [Validators.required])
    });

  }


  addQuestionAttachment(event) {
    const fileReader = new FileReader();
    const img = event.target.files[0];
    fileReader.onload = () => this.new_question.attachment = fileReader.result;
    fileReader.readAsDataURL(img);
  }

  addAnsverAttachment(event) {
    const fileReader = new FileReader();
    const img = event.target.files[0];
    fileReader.onload = () => this.new_answer.attachment = fileReader.result;
    fileReader.readAsDataURL(img);
  }

  addAnswer() {
    if (this.correctAnswerInputType === 'num' ) {
         this.answerNumber = ['1', '2'];
         this.questionForm.addControl( ( (this.answerNumber.length).toString() ),
                                                  new FormControl('', [Validators.required] )
                                                );
        } else {
                    this.questionForm.addControl( ( (this.answerNumber.length + 1).toString() ),
                                                  new FormControl('', [Validators.required] )
                                                );
                    this.answerNumber.push((this.answerNumber.length + 1).toString());
                    console.log('this.answerNumber = ', this.answerNumber);
                }
  }

  correctAnswer(number) {
    if (this.correctAnswerInputType === 'radio') {
        this.correctAnswers = [number];
    } else {
            this.correctAnswers.indexOf(number) === -1 ?
            this.correctAnswers.push(number) : this.correctAnswers.splice(this.correctAnswers.indexOf(number), 1);
    }
    console.log('this.correctAnswers = ', this.correctAnswers);

  }

  onQuestionTypeSelect(event) {
    console.log('onQuestionTypeSelect = ', event.target.value);
    if (event.target.value === '1') { this.correctAnswerInputType = 'radio'; }
    if (event.target.value === '2') { this.correctAnswerInputType = 'checkbox'; }
    if (event.target.value === '3') { this.correctAnswerInputType = 'txt'; }
    if (event.target.value === '4') { this.correctAnswerInputType = 'num';
                                      this.addAnswer();
                                     }
    console.log('this.correctAnswerInputType = ', this.correctAnswerInputType);

    // if (event.target.value === '2') {
    //     this.correctAnswerInputType = 'checkbox';
    // } else {
    //     this.correctAnswerInputType = 'radio';
        // this.correctAnswers = [Math.max(...this.correctAnswers) + ''];
    // }
  }

  onAnswerResourseSelect(event) {
    console.log('onAnswerResourseSelect = ', event.target.value);
    if (event.target.value === '1') { this.answerResourse = 'text'; }
    if (event.target.value === '2') { this.answerResourse = 'file'; }
    if (event.target.value === '3') { this.answerResourse = 'text_file'; }
    console.log('this.answerResourse = ', this.answerResourse);
  }


  setQuestionType(elem: HTMLSelectElement) {
    const value = elem.options[elem.selectedIndex].value;
    const index = elem.options[elem.selectedIndex].index + 1; // починаємо нумерацію з одиниці
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

  // setVariantsNumber(elem: HTMLSelectElement) {
  //   const value = elem.options[elem.selectedIndex].value;
  //   console.log('Variants number = ', value);
  // }


addQuestionSubmit() {

  const questionJSON = JSON.stringify({
    test_id: this.selTestId,
    question_text: this.new_question.question_text,
    level: this.new_question.level,
    type: this.new_question.type,
    attachment: this.new_question.attachment
  });

  console.log('questionJSON = ', questionJSON);

  this.questionService.addQuestion(questionJSON).subscribe((dataQuestions: IResponse) => {
    if (dataQuestions) {
      this.matDialogRef.close();
    }
  });

}


closeDialog() {
  this.matDialogRef.close();
}

}
