import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { QuestionsGet } from './questions-interface';
import { QuestionsAdd } from './questions-interface';
import { TestNameByID } from './questions-interface';

import { IResponse } from './questions-interface';

@Injectable()
export class QuestionsService {


  private getQuestionURL: string = 'http://vps9615.hyperhost.name:443/api/question/getRecords';
  private getAllQuestionsURL: string = 'http://vps9615.hyperhost.name:443/api/question/getRecords/0';
  private addQuestionsURL: string = 'http://vps9615.hyperhost.name:443/api/question/insertData';
  private getEntityValueURL: string = 'http://vps9615.hyperhost.name:443/api/EntityManager/getEntityValues';
  private editQuestionURL = 'http://vps9615.hyperhost.name:443/api/question/update';

constructor(private http: HttpClient) { }


getAllQuestions(): Observable<QuestionsGet[]> {
    return this.http.get<QuestionsGet[]>(this.getAllQuestionsURL);
  }

getQuestionById(id: number) {
    return this.http.get(this.getQuestionURL + '/' + id);
  }



//   interface QuestionsAdd {
//    question_id: string;
//    test_id: string;
//    question_text: string;
//    level: string;
//    type: string;
//    attachment: string;}

addQuestion(body): void {
    this.http.post<QuestionsAdd>(this.addQuestionsURL, body).subscribe();
  }

//  addQuestion(title: string, description: string) {
//    const body = {subject_name: title, subject_description: description};
//    return this.http.post(this.addQuestionsURL, body);
//  }

  editQuestion(id: number, title: string, description: string) {
    const body = {question_name: title, question_description: description};
    return this.http.post(this.editQuestionURL + '/' + id, body);
  }



  getEntityValue(body): Observable<TestNameByID[]> {
    return this.http.post<TestNameByID[]>(this.getEntityValueURL, body);
  }

//Видалення завдання

  deleteQuestion(id): Observable<IResponse> {
     alert('id видаленого завданя: '+ id)

    return this.http.delete<IResponse>(`http://vps9615.hyperhost.name:443/api/question/del/${id}`);
//    return this.http.delete<IResponse>('http://vps9615.hyperhost.name:443/api/question/del/'+id);

  }

}
