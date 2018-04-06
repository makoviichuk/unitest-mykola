import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { QuestionsService } from '../questions.service';

import { Questions } from '../questions-interface';


@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})


export class AddQuestionComponent implements OnInit {

 questions: Questions[];
  form: FormGroup;

  constructor(
    //private route: ActivatedRoute,
    private questionService: QuestionsService,
    private matDialogRef: MatDialogRef<AddQuestionComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
 

  ngOnInit() {
    this.questionService.getAllQuestions()
      .subscribe((data: Questions[]) => {
        this.questions = data;
      });

    this.form = new FormGroup({
      'title': new FormControl(null, [Validators.required]),
      'description': new FormControl(null, [Validators.required])
    });
  }

  closeDialog() {
    this.matDialogRef.close();
  }

  onSubmit() {
    const formData = this.form.value;
   
    console.log(formData);
          
  }


//addQuestions(body): void {
//    this.http.post<QuestionsAdd>(this.addQuestionsURL, body).subscribe();
//  } 


//onSubmit() {
//    const formData = this.form.value;
//    this.questionService.addQuestion(formData.description)
//        .subscribe((question: Questions) => {
//        if (question) {
//          console.log(question);
//          this.matDialogRef.close();
//        }
//      });
//  }


}
