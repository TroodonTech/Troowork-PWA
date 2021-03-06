import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { InspectionService } from '../../../../service/inspection.service';
import { Inspection } from '../../../../model-class/Inspection';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../../../dialog/confirmationdialog/confirmationdialog.component';
@Component({
  selector: 'app-inspectiontemplateandquestions-view',
  templateUrl: './inspectiontemplateandquestions-view.component.html',
  styleUrls: ['./inspectiontemplateandquestions-view.component.scss']
})
export class InspectiontemplateandquestionsViewComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  TemplateID;
  loading;
  checkFlag;
  url_base64_decode(str) {
    var output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw 'Illegal base64url string!';
    }
    return window.atob(output);
  }

  searchform: FormGroup;
  template: Inspection[];
  viewinspectionTemplate: any;
  delete_tempId: number;
  templateQuestionID: number;
  key: number;
  searchFlag: any;
  tempkey1;
  regexStr = '^[a-zA-Z0-9_ ]*$';
  @Input() isAlphaNumeric: boolean;
  constructor(private formBuilder: FormBuilder, private inspectionService: InspectionService, private el: ElementRef, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }
  @HostListener('keypress', ['$event']) onKeyPress(event) {
    return new RegExp(this.regexStr).test(event.key);
  }

  @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
    this.validateFields(event);
  }

  validateFields(event) {
    setTimeout(() => {

      this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^A-Za-z ]/g, '').replace(/\s/g, '');
      event.preventDefault();

    }, 100)
  }
  showInspectionTemplateTable(tempKey) {
    this.tempkey1 = tempKey;
    if (!(this.TemplateID)) {
      this.searchFlag = false;
      this.viewinspectionTemplate = false;
    }
    else {
      this.inspectionService
        .getInspectionTemplateTable(tempKey, this.OrganizationID)
        .subscribe((data: Inspection[]) => {
          this.searchFlag = true;
          this.viewinspectionTemplate = data;
        });
    }
  }
  // deleteInspTemplate() {

  //   this.checkFlag = true;
  //   this.inspectionService
  //     .DeleteInspectionTemplate(this.delete_tempId, this.templateQuestionID, this.employeekey, this.OrganizationID).subscribe(() => {
  //       this.checkFlag = false;
  //       this.inspectionService
  //         .getInspectionTemplateTable(this.tempkey1, this.OrganizationID)
  //         .subscribe((data: Inspection[]) => {
  //           this.viewinspectionTemplate = data;
  //         });

  //     });
  // }
  deleteInspTemplatePass(templateID, templateQuestionID) {
    this.delete_tempId = templateID;
    this.templateQuestionID = templateQuestionID;
    this.checkFlag = true;
    const message = `Are you sure !!  Do you want to delete`;
    const dialogData = new ConfirmDialogModel("DELETE", message);
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.inspectionService
          .DeleteInspectionTemplate(this.delete_tempId, this.templateQuestionID, this.employeekey, this.OrganizationID).subscribe(() => {
            this.checkFlag = false;
            this.inspectionService
              .getInspectionTemplateTable(this.tempkey1, this.OrganizationID)
              .subscribe((data: Inspection[]) => {
                this.viewinspectionTemplate = data;
              });

          });
      } else {
        this.checkFlag = false;
      }
    });
  }
  searchTNandTQ(SearchValue, TemplateID) {

    var value = SearchValue.trim();

    if (value.length >= 3) {
      this.inspectionService
        .SearchTempNameandQuestion(value, TemplateID, this.OrganizationID).subscribe((data: Inspection[]) => {
          this.viewinspectionTemplate = data;

        });
    }
    else if (value.length == 0) {
      this.inspectionService
        .getInspectionTemplateTable(this.tempkey1, this.OrganizationID)
        .subscribe((data: Inspection[]) => {
          this.searchFlag = true;
          this.viewinspectionTemplate = data;
        });
    }
  }
  ngOnInit() {

    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();

    this.checkFlag = false;
    this.searchFlag = false;
    this.TemplateID = "";
    this.inspectionService
      .getTemplateNameList(this.employeekey, this.OrganizationID)
      .subscribe((data: Inspection[]) => {
        this.template = data;
      });
    this.searchform = this.formBuilder.group({
      searchTemplateNameAndQuestion: ['', Validators.required]
    });
  }

}
