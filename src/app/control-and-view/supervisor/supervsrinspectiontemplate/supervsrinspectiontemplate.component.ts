import { Component, OnInit } from '@angular/core';
import { InspectionService } from '../../../service/inspection.service';
import { Inspection } from '../../../model-class/Inspection';
import { ActivatedRoute, Router } from '@angular/router';
import { ConectionSettings } from '../../../service/ConnectionSetting';
import { HttpClient } from '@angular/common/http';
// import { ViewinspectionmanagerComponent } from "../../manager/inspection/viewinspectionmanager/viewinspectionmanager.component";
import { DatepickerOptions } from 'ng2-datepicker';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../dialog/alertdialog/alertdialog.component';
const url = ConectionSettings.Url + '/inspection_Upload';

@Component({
  selector: 'app-supervsrinspectiontemplate',
  templateUrl: './supervsrinspectiontemplate.component.html',
  styleUrls: ['./supervsrinspectiontemplate.component.scss']
})
export class SupervsrinspectiontemplateComponent implements OnInit {
  checkFlag;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  public uploader: FileUploader = new FileUploader({ url: '', itemAlias: 'photo' });
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

  options: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2030,
    displayFormat: 'MM/DD/YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    //locale: frLocale,
    //minDate: new Date(Date.now()), // Minimal selectable date
    //maxDate: new Date(Date.now()),  // Maximal selectable date
    barTitleIfEmpty: 'Click to select a date',
    placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
    addClass: '', // Optional, value to pass on to [ngClass] on the input field
    addStyle: { 'font-size': '18px', 'width': '100%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };


  viewEmpInspectionDetails;
  inspKey$;
  names;
  temp_id;
  inspectionDetail;
  inspectionDetail1;
  ScoreName;
  TemplateQuestionID;
  questionsCount;
  val;
  Notes;
  Temp_templateId;
  ind = 0;
  TemplateDetails;
  lastIndexValue;
  isMailed;
  emp_EmailId;
  audit_EmailId;
  inspectionAssignEmp;

  // for star rating 
  starList = [];
  rating = [];
  value;
  addUrl;


  pickValues;

  setStar3(k, data: any) {
    this.rating[k] = data + 1;
    this.value = this.rating[k];
    for (var i = 0; i <= 2; i++) {
      if (i <= data) {
        this.starList[k][i] = false;
      }
      else {
        this.starList[k][i] = true;
      }
    }
  }
  setStar(k, data: any) {
    this.rating[k] = data + 1;
    this.value = this.rating[k];
    for (var i = 0; i <= 4; i++) {
      if (i <= data) {
        this.starList[k][i] = false;
      }
      else {
        this.starList[k][i] = true;
      }
    }
  }

  // for star rating 

  convert_DT(str) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }
  arrayUnique(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j]) {
          a.splice(j--, 1);
        }
      }
    }
    return a;
  };

  lastIndex(array, val) {
    var a = [];
    a = array;
    var b = val;
    var z = null;
    for (var i = 0; i < a.length; i++) {
      if (b == a[i])
        z = i;
    }
    return z;
  }
  Scoringtype = { ratingValue: [], inspectionNotes: [], rating_yn: [], ObservationDeficiency: [], CorrectiveAction: [], CompletedDate: [] };

  templateQuestionvalues = {};
  today_DT = this.convert_DT(new Date());
  count = 0;
  saveInspection = {};

  constructor(private inspectionService: InspectionService, private route: ActivatedRoute, private router: Router, private http: HttpClient, private dst: DataServiceTokenStorageService, private dialog: MatDialog) {
    this.route.params.subscribe(params => this.inspKey$ = params.InspectionOrderKey);
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

    this.inspectionService.InspectionDetails(this.inspKey$, this.OrganizationID).subscribe((data: any[]) => {
      this.viewEmpInspectionDetails = data;
      this.questionsCount = this.viewEmpInspectionDetails.length;
      this.val = data;
      this.inspectionAssignEmp = this.viewEmpInspectionDetails[0].employeeID;
      if (this.viewEmpInspectionDetails[0].ScoreName === 'Yes/No') {
        this.names = ['Yes', 'No', 'N/A'];
        this.ScoreName = this.viewEmpInspectionDetails[0].ScoreName;
      }
      else if (this.viewEmpInspectionDetails[0].ScoreName === 'Pass/Fail') {
        this.names = ['Fail', 'N/A'];
        this.ScoreName = this.viewEmpInspectionDetails[0].ScoreName;
      } else if (this.viewEmpInspectionDetails[0].ScoreName === '0-25') {
        this.inspectionService.getPickListValues(this.OrganizationID).subscribe((data: any[]) => {
          this.pickValues = data;
        });
        this.ScoreName = this.viewEmpInspectionDetails[0].ScoreName;
      } else {
        this.ScoreName = this.viewEmpInspectionDetails[0].ScoreName;
      }
      // else if(this.viewEmpInspectionDetails[0].ScoreName === '5 Star'){
      //   this.starList = [true,true,true,true,true]; 
      // }
      // else if(this.viewEmpInspectionDetails[0].ScoreName === '3 Star'){
      //   this.starList = [true,true,true]; 
      // }
      this.Temp_templateId = this.viewEmpInspectionDetails[0].TemplateID;
      this.inspectionService
        .templateQuestionService(this.viewEmpInspectionDetails[0].TemplateID, this.OrganizationID).subscribe((data: any[]) => {
          this.TemplateDetails = data;
          for (var i = 0; i < this.TemplateDetails.length; i++) {
            if (this.viewEmpInspectionDetails[0].ScoreName === '5 Star') {
              this.starList[i] = [true, true, true, true, true];
            }
            else if (this.viewEmpInspectionDetails[0].ScoreName === '3 Star') {
              this.starList[i] = [true, true, true];
            }
          }
        });
    });

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', item, status, response);
      // alert('File uploaded successfully');
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'File uploaded successfully',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
    };

  }
  saveRatings(TemplateQuestionID, ScoreName) {
    if (ScoreName === 'Yes/No' || ScoreName === 'Pass/Fail') {
      var length = Object.keys(this.Scoringtype.rating_yn).length;
      var arrayLength = this.Scoringtype.rating_yn.length;
      var value = this.Scoringtype.rating_yn[arrayLength - 1];
      this.Scoringtype.ratingValue.push({ rating: value, questionID: TemplateQuestionID });
    }
    else if (ScoreName === '5 Star') {
      this.Scoringtype.ratingValue.push({ rating: this.value, questionID: TemplateQuestionID });
    }
    else if (ScoreName === '3 Star') {
      this.Scoringtype.ratingValue.push({ rating: this.value, questionID: TemplateQuestionID });
    } else if (ScoreName === '0-25') {
      // var val=this.Scoringtype.rating_yn[TemplateQuestionID];
      // this.Scoringtype.ratingValue.push({ rating: this.value, questionID: TemplateQuestionID });

      var length = Object.keys(this.Scoringtype.rating_yn).length;
      var arrayLength = this.Scoringtype.rating_yn.length;
      var value = this.Scoringtype.rating_yn[arrayLength - 1];

      this.Scoringtype.ratingValue.push({ rating: value, questionID: TemplateQuestionID });

    }
  }
  inspectionCompleted() {
    this.checkFlag = true;
    var temp = [];
    var choices1 = [];
    choices1[0] = this.Scoringtype;
    var totalQuestions = this.questionsCount;
    var indexObj = [];
    var ratingIndexlist = [];
    var noteIndexList = [];
    var questionidList = [];
    var observeIndexList = [];
    var actionIndexList = [];
    var completeDateIndexList = [];

    if (this.ScoreName === 'Yes/No' || this.ScoreName === 'Pass/Fail' || this.ScoreName === '0-25') {
      for (var j = 0; j < this.val.length; j++) {
        temp.push("" + this.val[j].TemplateQuestionID);
      }
      ratingIndexlist = Object.keys(this.Scoringtype.rating_yn);
      noteIndexList = Object.keys(this.Scoringtype.inspectionNotes);
      questionidList = this.arrayUnique(ratingIndexlist.concat(temp));

      observeIndexList = Object.keys(this.Scoringtype.ObservationDeficiency);
      actionIndexList = Object.keys(this.Scoringtype.CorrectiveAction);
      completeDateIndexList = Object.keys(this.Scoringtype.CompletedDate);
    }
    else {
      noteIndexList = Object.keys(this.Scoringtype.inspectionNotes);

      observeIndexList = Object.keys(this.Scoringtype.ObservationDeficiency);
      actionIndexList = Object.keys(this.Scoringtype.CorrectiveAction);
      completeDateIndexList = Object.keys(this.Scoringtype.CompletedDate);

      indexObj = this.Scoringtype.ratingValue;
      if (indexObj) {
        for (var j = 0; j < indexObj.length; j++) {
          ratingIndexlist.push("" + indexObj[j].questionID);
        }
      }
      questionidList = this.arrayUnique(noteIndexList.concat(ratingIndexlist));
    }

    if (questionidList.length === totalQuestions && this.ScoreName === 'Pass/Fail') {
      var questionValues = "Pass";
      var starRating = null;
      var notes = null;
      var questionid = null;

      var observe = null;
      var action = null;
      var completedate = null;

      var i = 0;
      var j = 0;
      var k = 0;

      for (var i = i; i < questionidList.length; i++) {// includes actual qn ids
        questionValues = "Pass";
        notes = null;

        observe = null;
        action = null;
        completedate = null;

        questionid = questionidList[i];
        for (j = 0; j < noteIndexList.length; j++) {
          if (noteIndexList[j] === questionid) {
            notes = this.Scoringtype.inspectionNotes[questionid].trim();
            // break;
          }

          if (observeIndexList[j] === questionid) {
            observe = this.Scoringtype.ObservationDeficiency[questionid];
            if (observe) {
              observe = observe.trim();
            }
            //  break;
          }

          if (actionIndexList[j] === questionid) {
            action = this.Scoringtype.CorrectiveAction[questionid];
            if (action) {
              action = action.trim();
            }
            //  break;
          }

          if (completeDateIndexList[j] === questionid) {
            completedate = this.Scoringtype.CompletedDate[questionid];
            completedate = this.convert_DT(completedate);
          }

        }

        // for (var k = 0; k < ratingIndexlist.length; k++) {
        //   if (ratingIndexlist[k] === questionid) {
        //     this.lastIndexValue = this.lastIndex(ratingIndexlist, questionidList[i]);

        //     if (this.lastIndexValue !== null) {
        //       questionValues = this.Scoringtype.ratingValue[this.lastIndexValue].rating;
        //     } else {
        //       questionValues = "Pass";
        //     }
        //     break;
        //   }
        // }

        if (this.Scoringtype.rating_yn[questionid]) {
          questionValues = this.Scoringtype.rating_yn[questionid];
          if (questionValues === 'undefined') {
            questionValues = "Pass";
          }
        } else {
          questionValues = "Pass";
        }

        this.inspectionDetail =
        {
          OrganizationID: this.OrganizationID,
          inspectionkey: this.inspKey$,
          employeekey: this.employeekey,
          inspectionnotes: notes,
          templateQstnValues: questionValues,
          templateid: this.Temp_templateId,
          questionid: questionid,

          ObservationDeficiency: observe,
          CorrectiveAction: action,
          CompletedDate: completedate,

        };
        this.inspectionService
          .InspectionSaveService(this.inspectionDetail)

      }
      this.inspectionDetail1 =
      {
        OrganizationID: this.OrganizationID,
        InspectionorderKey: this.inspKey$,
        EmployeeKey: this.employeekey,

      };
      this.inspectionService
        .inspectionCompletedService(this.inspectionDetail1).subscribe(res => {
          this.checkFlag = false;
          if (this.isMailed == true) {//varun-> sending Email for inspection
            this.inspectionService.emailForInspectionComp(this.inspectionAssignEmp, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {

              this.emp_EmailId = data[0].AssignEmpEmailId;
              this.audit_EmailId = data[0].EmailID;
              if (!(this.emp_EmailId)) {
                // alert('Employee Has No Email ID');
                const dialogRef = this.dialog.open(AlertdialogComponent, {
                  data: {
                    message: 'Employee Has No Email ID!',
                    buttonText: {
                      cancel: 'Done'
                    }
                  },
                });
                return;
              }
              if (!(this.audit_EmailId)) {
                // alert('Auditor Has No Email ID');
                const dialogRef = this.dialog.open(AlertdialogComponent, {
                  data: {
                    message: 'Auditor Has No Email ID!',
                    buttonText: {
                      cancel: 'Done'
                    }
                  },
                });
                return;
              }
              this.inspectionService.getInspectionDetailsForEmail(this.inspKey$, this.OrganizationID).subscribe((inspectionEmail: any[]) => {

                var emailBody;
                emailBody = '<b>' + inspectionEmail[0].TemplateName + '</b>' + '(' + inspectionEmail[0].ScoreName + ')' + '<br>'

                for (var i = 0; i < inspectionEmail.length; i++) {
                  emailBody = emailBody + inspectionEmail[i].Question + ' : ' + inspectionEmail[i].Value + '<br>';

                }

                const obj = {
                  from: this.audit_EmailId,
                  to: this.emp_EmailId,
                  subject: 'Inspection By -' + inspectionEmail[0].InspectorName,
                  html: emailBody
                };
                const url = ConectionSettings.Url + "/sendmail";
                return this.http.post(url, obj)
                  .subscribe(res => {
                    // alert('Mail Sent Successfully...');
                    const dialogRef = this.dialog.open(AlertdialogComponent, {
                      data: {
                        message: 'Mail Sent Successfully...',
                        buttonText: {
                          cancel: 'Done'
                        }
                      },
                    });
                  });

              });
            });
          }
          // this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['Viewinspctnbysprvsr'] } }]);

          // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewInspectionManager',this.inspKey$] } }]);

          if (this.role == 'Manager') {
            this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewInspectionManager', this.inspKey$] } }]);
          }
          // else if (this.role == 'Employee' && this.IsSupervisor == 1) {
          else if (this.role == 'Supervisor') {
            this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewInspectionManager', this.inspKey$] } }]);
          }
        });

    }
    else if (questionidList.length === totalQuestions && this.ScoreName !== 'Pass/Fail') {
      questionValues = null;
      var starRating = null;
      var notes = null;
      var questionid = null;

      var observe = null;
      var action = null;
      var completedate = null;

      var i = 0;
      var j = 0;
      var k = 0;

      for (i = i; i < questionidList.length; i++) {// includes actual qn ids
        questionValues = null;
        notes = null;

        observe = null;
        action = null;
        completedate = null;

        questionid = questionidList[i];
        for (j = 0; j < noteIndexList.length; j++) {
          if (noteIndexList[j] === questionid) {
            notes = this.Scoringtype.inspectionNotes[questionid].trim();
            // break;
          }

          if (observeIndexList[j] === questionid) {
            observe = this.Scoringtype.ObservationDeficiency[questionid];
            if (observe) {
              observe = observe.trim();
            }
            //     break;
          }

          if (actionIndexList[j] === questionid) {
            action = this.Scoringtype.CorrectiveAction[questionid];
            if (action) {
              action = action.trim();
            }
            //      break;
          }

          if (completeDateIndexList[j] === questionid) {
            completedate = this.Scoringtype.CompletedDate[questionid];
            completedate = this.convert_DT(completedate);
          }
        }
        // for (k = 0; k < ratingIndexlist.length; k++) {
        //   this.lastIndexValue = 0;
        //   if (ratingIndexlist[k] === questionid) {
        //     this.lastIndexValue = this.lastIndex(ratingIndexlist, questionidList[i]);
        //     var x = this.lastIndexValue.length - ratingIndexlist.length;
        //     if (this.lastIndexValue != null) {
        //       questionValues = this.Scoringtype.ratingValue[this.lastIndexValue].rating;
        //     }
        //     else {
        //       questionValues = null;
        //     }
        //     break;
        //   }
        // }
        if (this.ScoreName === '3 Star') {
          for (k = 0; k < ratingIndexlist.length; k++) {
            this.lastIndexValue = 0;
            if (ratingIndexlist[k] === questionid) {
              this.lastIndexValue = this.lastIndex(ratingIndexlist, questionidList[i]);
              var x = this.lastIndexValue.length - ratingIndexlist.length;
              if (this.lastIndexValue != null) {
                questionValues = this.Scoringtype.ratingValue[this.lastIndexValue].rating;
              }
              else {
                questionValues = null;
              }
              break;
            }
          }
        }
        else if (this.ScoreName === '5 Star') {
          for (k = 0; k < ratingIndexlist.length; k++) {
            this.lastIndexValue = 0;
            if (ratingIndexlist[k] === questionid) {
              this.lastIndexValue = this.lastIndex(ratingIndexlist, questionidList[i]);
              var x = this.lastIndexValue.length - ratingIndexlist.length;
              if (this.lastIndexValue != null) {
                questionValues = this.Scoringtype.ratingValue[this.lastIndexValue].rating;
              }
              else {
                questionValues = null;
              }
              break;
            }
          }
        }
        else {

          if (this.Scoringtype.rating_yn[questionid]) {
            questionValues = this.Scoringtype.rating_yn[questionid];
          } else {
            questionValues = null;
          }
        }

        this.inspectionDetail =
        {
          OrganizationID: this.OrganizationID,
          inspectionkey: this.inspKey$,
          employeekey: this.employeekey,
          inspectionnotes: notes,
          templateQstnValues: questionValues,
          templateid: this.Temp_templateId,
          questionid: questionid,

          ObservationDeficiency: observe,
          CorrectiveAction: action,
          CompletedDate: completedate,


        };
        this.inspectionService
          .InspectionSaveService(this.inspectionDetail)
      }
      this.inspectionDetail1 =
      {
        OrganizationID: this.OrganizationID,
        InspectionorderKey: this.inspKey$,
        EmployeeKey: this.employeekey,

      };
      this.inspectionService
        .inspectionCompletedService(this.inspectionDetail1).subscribe(res => {
          this.checkFlag = false;
          if (this.isMailed == true) {//varun-> sending Email for inspection
            this.inspectionService.emailForInspectionComp(this.inspectionAssignEmp, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {

              this.emp_EmailId = data[0].AssignEmpEmailId;
              this.audit_EmailId = data[0].EmailID;
              if (!(this.emp_EmailId)) {
                // alert('Employee Has No Email ID');
                const dialogRef = this.dialog.open(AlertdialogComponent, {
                  data: {
                    message: 'Employee Has No Email ID!',
                    buttonText: {
                      cancel: 'Done'
                    }
                  },
                });
                return;
              }
              if (!(this.audit_EmailId)) {
                // alert('Auditor Has No Email ID');
                const dialogRef = this.dialog.open(AlertdialogComponent, {
                  data: {
                    message: 'Auditor Has No Email ID!',
                    buttonText: {
                      cancel: 'Done'
                    }
                  },
                });
                return;
              }
              this.inspectionService.getInspectionDetailsForEmail(this.inspKey$, this.OrganizationID).subscribe((inspectionEmail: any[]) => {

                var emailBody;
                emailBody = '<b>' + inspectionEmail[0].TemplateName + '</b>' + '(' + inspectionEmail[0].ScoreName + ')' + '<br>'

                for (var i = 0; i < inspectionEmail.length; i++) {
                  emailBody = emailBody + inspectionEmail[i].Question + ' : ' + inspectionEmail[i].Value + '<br>';

                }

                const obj = {
                  from: this.audit_EmailId,
                  to: this.emp_EmailId,
                  subject: 'Inspection By -' + inspectionEmail[0].InspectorName,
                  html: emailBody
                };
                const url = ConectionSettings.Url + "/sendmail";
                return this.http.post(url, obj)
                  .subscribe(res => {
                    // alert('Mail Sent Successfully...');
                    const dialogRef = this.dialog.open(AlertdialogComponent, {
                      data: {
                        message: 'Mail Sent Successfully...',
                        buttonText: {
                          cancel: 'Done'
                        }
                      },
                    });
                  });
              });
            });
          }
          // this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['Viewinspctnbysprvsr'] } }]);
          // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewInspectionManager',this.inspKey$] } }]);
          if (this.role == 'Manager') {
            this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewInspectionManager', this.inspKey$] } }]);
          }
          // else if (this.role == 'Employee' && this.IsSupervisor == 1) {
          else if (this.role == 'Supervisor') {
            this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewInspectionManager', this.inspKey$] } }]);
          }
        });

    }
  }

  FileSelected() {
    this.addUrl = '?IoKey=' + this.inspKey$ + '&empkey=' + this.employeekey + '&OrganizationID=' + this.OrganizationID;
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.url = url + this.addUrl;
    }
    this.uploader.uploadAll();
  }
}
