import { Component, OnInit } from '@angular/core';
import { InspectionService } from '../../../../service/inspection.service';
import { Inspection } from '../../../../model-class/Inspection';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
@Component({
  selector: 'app-inspectiontemplate-create',
  templateUrl: './inspectiontemplate-create.component.html',
  styleUrls: ['./inspectiontemplate-create.component.scss']
})
export class InspectiontemplateCreateComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  ScoreTypeKey;
  InspTempName;
  field;

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

  scores: Inspection[];
  title = 'dynamicrow';
  fieldArray: Array<any> = [];
  ; newAttribute: any = {};

  constructor(private inspectionService: InspectionService, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }

  addFieldValue() {
    this.fieldArray.push('')

  }
  deleteFieldValue(index) {
    this.fieldArray.splice(index, 1);
  }

  valuesSave(ScoreTypeKey, InspTempName) {
    this.checkFlag = true;

    var ScoringTypeKey;
    var TemplateID;
    var templatename;
    if (InspTempName && !InspTempName.trim()) {
      // alert("Please Enter Inspection Template Name!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please Enter Inspection Template Name!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    if (ScoreTypeKey) {
      ScoringTypeKey = this.ScoreTypeKey;
    }
    else {
      ScoringTypeKey = null;
      // alert("Scoring Type is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Scoring Type is not provided !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    if (InspTempName) {
      InspTempName = this.InspTempName.trim();
    }
    else {
      InspTempName = null;
      // alert("Inspection Template Name is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Inspection Template Name is not provided !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    var arr = [];
    var t1;
    for (var i = 0; i < this.fieldArray.length; i++) {
      if (!(this.fieldArray[i])) {
        var index = i + 1;
        // alert("Question " + index + " is not provided !");
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: "Question " + index + " is not provided !",
            buttonText: {
              cancel: 'Done'
            }
          },
        });
        this.checkFlag = false;
        return;
      }
      if (this.fieldArray[i]) {
        this.fieldArray[i] = this.fieldArray[i].trim();
      }
      arr.push(this.fieldArray[i]);
    }
    this.fieldArray;
    var TempQustArry = [];
    var QustArry;
    for (var j = 0; j < arr.length; j++) {
      TempQustArry.push(arr[j]);
    }
    QustArry = TempQustArry.join(',');
    if (QustArry === '') {
      QustArry = null;
      // alert(" Questions are not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Questions are not provided !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    if (QustArry && !QustArry.trim()) {
      // alert("Please Enter Question!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please Enter Question!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    this.inspectionService.checkforTemplate(InspTempName, this.OrganizationID).subscribe(res => {
      if (res[0].count == 0) {
        this.inspectionService.createInspectionTemplate(ScoreTypeKey, InspTempName, QustArry, this.employeekey, this.OrganizationID).subscribe(res => {
          this.ScoreTypeKey = "";
          this.InspTempName = null;
          this.fieldArray = [];
          // alert("Inspection Template Added !");
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'Inspection Template Added !',
              buttonText: {
                cancel: 'Done'
              }
            },
          });
          this.checkFlag = false;
          this.addFieldValue();
        });
      }
      else {

        this.ScoreTypeKey = "";
        this.InspTempName = null;
        this.fieldArray = [];
        // alert("Template Name already exists !");
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: 'Template Name already exists !',
            buttonText: {
              cancel: 'Done'
            }
          },
        });
        this.checkFlag = false;
        this.addFieldValue();
      }
    });
  }
  customTrackBy(index: number, obj: any): any {
    return index;
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
    this.addFieldValue();
    this.ScoreTypeKey = "";
    this.checkFlag = false;
    this.inspectionService
      .getScoreTypeList(this.OrganizationID)
      .subscribe((data: Inspection[]) => {
        this.scores = data;
      });
  }

}
