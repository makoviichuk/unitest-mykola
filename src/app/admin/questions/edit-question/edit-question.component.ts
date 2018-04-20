import {Component, Inject, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {QuestionsService} from '../questions.service';
import {QuestionsComponent} from '../questions.component';
import {IQuestions} from '../questions-interface';
import {IQuestionEdit} from '../questions-interface';
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

  question: IQuestions;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionsService,
    private matDialogRef: MatDialogRef<EditQuestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  // form;
 questions: IQuestions[];
 selTestId: string;

 edit_question: IQuestionEdit = {
    test_id: '',
    question_text: 'some text',
    level: '',
    type_index: '',
    type_name: '',
    attachment: ''
};

  ngOnInit() {
    this.getQuestion();

    console.log('selQuestId = ', this.data.sel_quest_id);
    console.log('selQuestName = ', this.data.sel_quest_name);

    this.form = new FormGroup({
      'title': new FormControl(null, [Validators.required]),
      'description': new FormControl(null, [Validators.required])
    });
  }

  getQuestion() {
    const id = this.data.question_id;
    this.questionService.getQuestionById(id)
      .subscribe((data: IQuestions) => {
        this.question = data;
      });
  }

  onSubmit() {
    const id = this.data.question_id;
    const formData = this.form.value;
    this.questionService.editQuestion(id, formData.title, formData.description)
      .subscribe((data: IQuestions) => {
        if (data) {
          this.matDialogRef.close();
        }
      });
  }

  closeDialog() {
    this.matDialogRef.close();
  }

}

