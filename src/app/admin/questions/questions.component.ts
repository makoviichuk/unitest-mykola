import { Component, OnInit } from '@angular/core';
import { QuestionsService } from './questions.service';
import {AddQuestionComponent} from './add-question/add-question.component';
import {EditQuestionComponent} from './edit-question/edit-question.component';


import { QuestionsGet } from './questions-interface';
import { QuestionsAdd } from './questions-interface';
import { Questions } from './questions-interface';
import { group } from '@angular/animations';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { IResponse } from './questions-interface';



@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
    providers: [ QuestionsService ]
})





export class QuestionsComponent implements OnInit {
    
     title: string = 'Завдання для тесту: ';

  questions: Questions[] = [];
  question: Questions; // = {};

  
//  subjects: Subjects;
  form: FormGroup;


  constructor(
    private service: QuestionsService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
 //При кожному ререндері компоненту будуть братись нові дані з сервера
    this.fillOutQuestionsTable();      
      
  }


openModalAdd() {
    this.dialog.open(AddQuestionComponent, {
      height: '600px',
      width: '600px',
      data: {name: 'test'}
    });
  }

openModalEdit(id) {
    this.dialog.open(EditQuestionComponent, {
      height: '600px',
      width: '800px',
      data: {subject_id: id, name: 'test'}
    });
  }


showRegForm() {
    
    
    
  }


        // метод який записує в масив "questions" дані про кожне завдання
              fillOutQuestionsTable() {
                this.service.getAllQuestions().subscribe(data => {
                          let testArr = [];
                          for (let i = 0; i < data.length; i++) {
                                                                    testArr.push(data[i].test_id);
                                                                }
                  let body = JSON.stringify({entity: "Test", ids: testArr});
                    
                    
                  this.service.getEntityValue(body).subscribe(response => {
                    // Фільтр для сутностей "Test" які приходять з сервера
                    testArr = response.map(val => {
                      return {
                        test_id: val.test_id,
                        test_name: val.test_name
                      }
                    });
                      
                    // Додавання завдань в масив "questions" {question_id, test_id, question_text, level, type, attachment}
                    for (let i = 0; i < data.length; i++) {
                      this.questions.push({
                        question_id: data[i].question_id,
                        test_id: data[i].test_id,
                        question_text: data[i].question_text,
                        level: data[i].level,
                        type: data[i].type,
                        attachment: data[i].attachment,
//                        test: ''
                      });
                        
                      // Додавання test_name для кожного завдання
//                      for (let j = 0; j < testArr.length; j++) {
//                        if (data[i].test_id === testArr[j].test_id) {
//                          this.questions[i].test = testArr[j].test_name;
//                        }          
//                       }
                        
                    }
                      
                  });
                });
              }

  //Видалення завдання
  handleDelete(index): void {
//     console.log(index);
    this.service.deleteQuestion(index).subscribe((data: IResponse) => {
      if(data.response === 'ok') {
      //При кожному видаленні будуть оновлюватися дані з сервера
//        this.questions=[];
        this.fillOutQuestionsTable(); // оновює але не заміняє список завданнь 
      }
    });
  }
  
  
  

}









