import { Component, OnInit, Input } from '@angular/core';
import { QuestionsService } from './questions.service';
import {AddQuestionComponent} from './add-question/add-question.component';
import {EditQuestionComponent} from './edit-question/edit-question.component';

import { IQuestionGet } from './questions-interface';
import { IQuestionSet } from './questions-interface';
import { IQuestions } from './questions-interface';
import { group } from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog} from '@angular/material';
import { IResponse } from './questions-interface';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DeleteConfirmComponent } from '../../shared/delete-confirm/delete-confirm.component';
import { ResponseMessageComponent } from '../../shared/response-message/response-message.component';
import { PaginationInstance } from 'ngx-pagination';
import { forEach } from '@angular/router/src/utils/collection';


@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
    providers: [ QuestionsService ]
})

export class QuestionsComponent implements OnInit {

      public config: PaginationInstance = {
        itemsPerPage: 5,
        currentPage: 1
      };

      offset = 0;

      selectedTestId: string;
      selectedTestName: string;
      questions: IQuestionGet[] = [];
      question: IQuestions;
      testIdNameArr = [];
      title_component = 'Завдання для тесту: ';
      form: FormGroup;

      testId: string;
      testName: string;
    // these params passed from  test.component, there is need to prescribe the method
    //
    // openQuestions(id: string, name: string) {
    //     this.router.navigate(['/admin/questions'], {
    //       queryParams: { testId: id, testName: name }
    //     });
    //    }
    // }
    // and on icon click event should be hanged method (click)="openQuestions(t.test_id, t.test_name)

  constructor(
    private service: QuestionsService,
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
      this.activatedRoute.queryParams.subscribe(params => {
      this.testId = params['testId'];
      this.testName = params['testName'];
      });
      console.log('Called Constructor');
   }



  ngOnInit() {
    console.log(' this.testId = ',  this.testId, ', this.testName = ', this.testName);
    this.createTestsIdNamesArray();

    if (this.testId) {
        this.createQuestionsTableByTestId(this.testId);
    }

  }


   createQuestionsTableByTestId(test_id) {
    this.testId = test_id;
    // this.testName = ;
    this.service.getQuestionsNumberByTest(this.testId).subscribe(respond => {
      console.log('questionsNumberByTest = ', respond['numberOfRecords']); // returns JSON in format {"numberOfRecords": "10"}
      const questionsNumberByTest = respond['numberOfRecords'];

      this.service.getQuestionsByTestId(test_id, questionsNumberByTest, this.offset).subscribe(data => {
        if ( data.length ) {
          this.questions = data;
        } else {
          this.questions = [];
          alert(' Вибраний тест ще не має завдань. Додайте завдання');
        }
        console.log('createQuestionsTableByTestId = ', this.questions);
      });

    });


  }

  createQuestionsTableBySelTestIndex(selTestIndex, limit = 1000, offset = 0) {
    this.testId = this.testIdNameArr[selTestIndex - 1].test_id;
    this.testName = this.testIdNameArr[selTestIndex - 1].test_name;
    console.log('this.testId  = ', this.testId, ' this.testName  = ', this.testName);

    this.service.getQuestionsNumberByTest(this.testId).subscribe(respond => {
      console.log('questionsNumberByTest = ', respond['numberOfRecords']); // returns JSON in format {"numberOfRecords": "10"}
      const questionsNumberByTest = respond['numberOfRecords'];

      this.service.getQuestionsByTestId(this.testId, questionsNumberByTest, this.offset).subscribe(data => {
        if ( data.length ) {
          this.questions = data;
        } else {
          this.questions = [];
          alert(' Вибраний тест ще не має завдань. Додайте завдання');
        }
        console.log('createQuestionsTableBySelTestIndex = ', this.questions);
      });

    });

  }



  openModalAdd(selTestIndex, selTestName) {
    // - 1  becouse dropped list has additional filds 'виберіть тест'
    this.testId = this.testIdNameArr[selTestIndex - 1].test_id;
    this.testName = selTestName;
  console.log('this.testId = ', this.testId, ', this.testName = ', this.testName);

    const matDialogRef = this.dialog.open(AddQuestionComponent, {
      height: '700px',
      width: '900px',
      data: {sel_TestId: this.testId, sel_TestName: this.testName}
    });
    matDialogRef.afterClosed().subscribe( () => this.createQuestionsTableByTestId(this.testId) );
  }

    openModalEdit(selQuestion) {


      const matDialogRef = this.dialog.open(EditQuestionComponent, {
        height: '700px',
        width: '900px',
        data: {sel_quest: selQuestion, sel_TestName: this.testName}
      });
      matDialogRef.afterClosed().subscribe( () => this.createQuestionsTableByTestId(selQuestion.test_id) );
    }


  createTestsIdNamesArray() {
     this.service.getAllTests().subscribe(data => {
        this.testIdNameArr = data.map(val => {
          return {
            test_id: val.test_id,
            test_name: val.test_name
          };
        });
        console.log('createTestsIdNamesArray.testIdNameArr = ', this.testIdNameArr);
     });
  }


  handleDelete(question_id): void {
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      width: '400px',
      data: {
        message: 'Ви справді бажаєте видалити завдання?'
      }
    });
    dialogRef.afterClosed().subscribe((Response: boolean) => {
      if (Response) {
        this.service.deleteQuestion(question_id).subscribe((data: IResponse) => {
          if (data.response === 'ok') {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: 'Завдання було успішно видалено!'
              }
            });
            this.createQuestionsTableByTestId(this.testId);
          }},
          () => {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: 'Виникла помилка при видаленні цього завдання!'
              }
            });
        });
      }
    });
  }


}
