import {Component, Inject, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {QuestionsService} from '../questions.service';
import {QuestionsComponent} from '../questions.component';
import {IQuestions} from '../questions-interface';
import {IQuestionGet} from '../questions-interface';
import {IQuestionSet} from '../questions-interface';
import {IResponse} from '../questions-interface';
import {ActivatedRoute} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss'],
  providers: [ QuestionsService ]
})


export class EditQuestionComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionsService,
    private matDialogRef: MatDialogRef<EditQuestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  public questionsComponent: QuestionsComponent;

 form: FormGroup;
 sel_question_id = this.data.sel_quest.question_id;
 sel_question_test_id = this.data.sel_quest.test_id;
 sel_question_test_name = this.data.sel_TestName;

//  questionsByTestId: IQuestionGet[];

  sel_question: IQuestionGet = {
    question_id: this.data.sel_quest.question_id,
    test_id: this.data.sel_quest.test_id,
    question_text: this.data.sel_quest.question_text,
    level: this.data.sel_quest.level,
    type: this.data.sel_quest.type,
    attachment: this.data.sel_quest.attachment
  };

 edited_question: IQuestionSet = {
    test_id: this.data.sel_quest.test_id,
    question_text: this.data.sel_quest.question_text,
    level: this.data.sel_quest.level,
    type: this.data.sel_quest.type,
    type_name: '',
    attachment: ''
    // attachment: this.data.sel_quest.attachment
  };


  ngOnInit() {

    console.log('this.sel_question OnInit = ', this.sel_question);
    console.log('this.data.sel_TestName = ', this.data.sel_TestName);

    this.form = new FormGroup({
      'title': new FormControl(null, [Validators.required]),
      'description': new FormControl(null, [Validators.required])
    });
  }

  getQuestion() {
    this.questionService.getQuestionById(this.data.sel_quest_id).subscribe((data: IQuestionGet) => {
        this.sel_question = data[0];
        // console.log('getQuestion id = ', id);
        // console.log('getQuestion data = ', data);
        console.log('getQuestion this.sel_question = ', this.sel_question);
        });
  console.log('getQuestion outer this.sel_question = ', this.sel_question);
  }


  // setQuestionId(elem: HTMLSelectElement) {
  //   const value = elem.options[elem.selectedIndex].value;
  //   console.log('Variants number = ', value);
  // }

   // setQuestionTestId(elem: HTMLSelectElement) {
  //   const value = elem.options[elem.selectedIndex].value;
  //   console.log('Variants number = ', value);
  // }

  setQuestionType(elem: HTMLSelectElement) {
    const value = elem.options[elem.selectedIndex].value;
    const index = elem.options[elem.selectedIndex].index + 1; // починаємо нумерацію з одиниці
    this.edited_question.type_name = value;
    this.edited_question.type = '' + index;
    console.log('type = ', index, ' type_name = ', value);

  }

  setQuestionLevel(elem: HTMLSelectElement) {
    const value = elem.options[elem.selectedIndex].value;
    this.edited_question.level = value;
    console.log('level = ', value);
  }

  setQuestionText(elem: HTMLSelectElement) {
    const value = elem.value;
    this.edited_question.question_text = value;
    console.log('QuestionText = ', value);
  }

  setVariantsNumber(elem: HTMLSelectElement) {
    const value = elem.options[elem.selectedIndex].value;
    console.log('Variants number = ', value);
  }

  // setResourse(elem: HTMLSelectElement) {
  //   const value = elem.options[elem.selectedIndex].value;
  //   this.edited_question.attachment = value;
  //   console.log('Attachment = ', value);
  // }



  editQuestionSubmit() {

    const questionJSON = JSON.stringify({
      question_id: this.sel_question_id,
      test_id: this.data.sel_quest.test_id,
      question_text: this.edited_question.question_text,
      level: this.edited_question.level,
      type: this.edited_question.type,
      attachment: this.edited_question.attachment
    });

    console.log('questionJSON = ', questionJSON);

    this.questionService.editQuestion(this.sel_question_id, questionJSON).subscribe((response: IQuestionGet) => {
    console.log('response = ', response);
    if (response) {
        this.matDialogRef.close();
      }
    });

  }

  closeDialog() {
    this.matDialogRef.close();
  }

}

