import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppService } from 'src/app/services/app.service';
import { Database, Table } from 'src/app/interfaces/database.interface';
import { TableSummaryComponent } from 'src/app/shared/table-summary/table-summary.component';
import { FormCreatorUpdaterComponent } from 'src/app/shared/form-creator-updater/form-creator-updater.component';
import { Router, RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TableSummaryComponent,
    FormCreatorUpdaterComponent,
    RouterModule,
    NgxSpinnerModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  contentFile = '';

  fileDatabase = {} as Database;

  unsubscribe = new Subject();

  formAddTable!: FormGroup;

  showContent = false;

  constructor(
    private appService: AppService,
    private formBuilder: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.initFormAddTables();
  }

  ngOnInit(): void {
    this.spinner.show(undefined, { fullScreen: true });
    this.getContentPrismaFile();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  initFormAddTables() {
    this.formAddTable = this.formBuilder.group({
      name: ['', [Validators.required]],
      type: ['model', [Validators.required]],
      fields: this.formBuilder.array([], [Validators.required]),
    });
  }

  updateTable(id: number): void {
    this.router.navigate(['/creation', id]);
  }

  getContentPrismaFile(): void {
    this.appService
      .getAllDatabase()
      .pipe(
        takeUntil(this.unsubscribe),
        tap((databaseContent: Database) => {
          this.fileDatabase = databaseContent;
          this.contentFile = this.appService.mapContentFromDatabase(
            this.fileDatabase
          );
          setTimeout(() => {
            this.spinner.hide();
            this.showContent = true;
          }, 500);
        })
      )
      .subscribe();
  }
}
