import {Component, Inject, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {QuestionsService} from '../questions.service';
// import {QuestionsComponent} from '../questions.component';
import {IQuestions} from '../questions-interface';
import {IQuestionSet } from '../questions-interface';
import {IResponse} from '../questions-interface';
import {ActivatedRoute} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';


@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss'],
  providers: [ QuestionsService ]
})
export class AddQuestionComponent implements OnInit {
  // @Input()

 form;
//  questions: IQuestions[];
 selTestId: string;
 selTestName: string;

 new_question: IQuestionSet = {
    test_id: this.selTestId,
    question_text: 'no text',
    level: '1',
    type: '1',
    type_name: '',
    attachment: 'no attachment'
};

constructor(
  private questionService: QuestionsService,
  private matDialogRef: MatDialogRef<AddQuestionComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any) { }



  ngOnInit() {

    this.selTestId = this.data.selId;
    this.selTestName = this.data.selName;

    console.log('selTestId = ', this.data.selId);
    console.log('selTestName = ', this.selTestName);

    this.form = new FormGroup({
      'title': new FormControl(null, [Validators.required]),
      'description': new FormControl(null, [Validators.required])
    });

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

  setVariantsNumber(elem: HTMLSelectElement) {
    const value = elem.options[elem.selectedIndex].value;
    console.log('Variants number = ', value);
  }

  setResourse(elem: HTMLSelectElement) {
    const value = elem.options[elem.selectedIndex].value;
    this.new_question.attachment = value;
    console.log('Attachment = ', value);
  }


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
