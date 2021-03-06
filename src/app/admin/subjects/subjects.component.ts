import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {PaginationInstance} from 'ngx-pagination';

import {SubjectService} from './services/subject.service';
import {Subject} from './subject';
import {ResponseMessageComponent} from '../../shared/response-message/response-message.component';
import {ModalSubjectComponent} from './modal-subject/modal-subject.component';
import {DeleteConfirmComponent} from '../../shared/delete-confirm/delete-confirm.component';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit {

  subjects: Subject[];
  form: FormGroup;

  public config: PaginationInstance = {
    itemsPerPage: 10,
    currentPage: 1
  };

  constructor(
    private subjectService: SubjectService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.getSubjects();
  }

  getSubjects(): void {
    this.subjectService.getSubjects()
      .subscribe((subjects: Subject[]) => {
        this.subjects = subjects;
      });
  }

  getTimetable(id): void {
    this.router.navigate(['admin/timetable'], { queryParams: { subjectId: id} });
  }

  getTests(id): void {
    this.router.navigate(['admin/tests'], { queryParams: { subjectId: id} });
  }

  openModal(id): void {
    const matDialogRef = this.dialog.open(ModalSubjectComponent, {
      width: '600px',
      data: {subject_id: id}
    });

      matDialogRef.afterClosed().subscribe((response: any) => {
        if (response) {
          if (response.status === 'SUCCESS') {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: response.message
              }
            });
            this.getSubjects();
          } else if (response.status === 'ERROR') {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: response.message
              }
            });
          }
          }
      });
  }

  deleteSubject(id): void {
    const matDialogRef = this.dialog.open(DeleteConfirmComponent, {
      width: '400px',
      data: {
        message: 'Ви справді бажаєте видалити даний предмет?'
      }
    });
    matDialogRef.afterClosed().subscribe((response: boolean) => {
      if (response) {
        this.subjectService.deleteSubject(id).subscribe((data: any) => {
            if (data.response === 'ok') {
              this.dialog.open(ResponseMessageComponent, {
                width: '400px',
                data: {
                  message: 'Даний предмет успішно видалено!'
                }
              });
              this.getSubjects();
            }},
          () => {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: 'Виникла помилка при видаленні предмета!'
              }
            });
          });
      }
    });
  }
}
