import { Component, OnInit } from '@angular/core';
import { SchedulingService } from '../../../../service/scheduling.service';
import { ActivatedRoute, Router } from "@angular/router";
import { ReportServiceService } from '../../../../service/report-service.service';

import { Location } from '@angular/common';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../../../dialog/confirmationdialog/confirmationdialog.component';

@Component({
  selector: 'app-edit-batch-work',
  templateUrl: './edit-batch-work.component.html',
  styleUrls: ['./edit-batch-work.component.scss']
})
export class EditBatchWorkComponent implements OnInit {
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  empName: String = null;
  empList;
  empKey: Number;
  scheduleName;
  scheduleDescription;
  scheduleNameKey$: Object;
  scheduleDetails;
  schName: String;
  BatchScheduleNameKey;
  loading: boolean;
  BatchScheduleTime;
  BatchScheduleEndTime;
  shiftdetails;
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
  public convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");

  }
  constructor(private ReportServiceService: ReportServiceService, private dst: DataServiceTokenStorageService, private scheduleService: SchedulingService, private router: Router, private route: ActivatedRoute, private _location: Location, private dialog: MatDialog) {
    this.route.params.subscribe(params => this.scheduleNameKey$ = params.scheduleNameKey);
  }

  setEmployeeForbatchSchedule(key) {
    this.empKey = key;
  }

  updateScheduleName() {
    this.checkFlag = true;
    if (!this.scheduleDetails.BatchSchduleName || !this.scheduleDetails.ScheduleDescription.trim()) {
      // alert("Assignment Name is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Assignment Name is not provided !!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return;
      });
    } if (!this.scheduleDetails.ScheduleDescription || !this.scheduleDetails.ScheduleDescription.trim()) {
      // alert("Assignment Description is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Assignment Description is not provided !!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return;
      });
    } if (!this.empKey) {
      // alert("Employee Name is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Employee Name is not provided !!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return;
      });
    }
    if (!this.BatchScheduleTime) {
      // alert("Start Time is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Start Time is not provided !!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return;
      });
    }
    if (!this.BatchScheduleEndTime) {
      // alert("End Time is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'End Time is not provided !!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return;
      });
    }
    if (this.scheduleDetails.BatchSchduleName) {
      this.scheduleDetails.BatchSchduleName = this.scheduleDetails.BatchSchduleName.trim();
    }
    if (this.scheduleDetails.ScheduleDescription) {
      this.scheduleDetails.ScheduleDescription = this.scheduleDetails.ScheduleDescription.trim();
    }

    var q = this.BatchScheduleEndTime.getHours();
    var q1 = this.BatchScheduleEndTime.getMinutes();
    var endTime = q + ":" + q1;

    var q2 = this.BatchScheduleTime.getHours();
    var q3 = this.BatchScheduleTime.getMinutes();
    var startTime = q2 + ":" + q3;

    if (this.scheduleDetails.checkBoxValue == true) {
      var scheduleDT = this.convert_DT(new Date());
      this.scheduleService
        .assignChangesForWO(scheduleDT, this.employeekey, this.OrganizationID, this.empKey, this.scheduleNameKey$, this.scheduleDetails.ScheduleDescription)
        .subscribe();
    }
    if (this.scheduleDetails.BatchSchduleName != this.schName) {
      this.scheduleService
        .checkForNewScheduleName(this.employeekey, this.OrganizationID, this.scheduleDetails.BatchSchduleName)
        .subscribe((data: any[]) => {
          if (data[0].count == 0) {
            this.scheduleService.updateScheduleNameDetails(this.employeekey, this.OrganizationID, this.scheduleDetails.BatchSchduleName, this.empKey, this.scheduleNameKey$, this.scheduleDetails.ScheduleDescription, startTime, endTime, this.scheduleDetails.Master_shiftID)
              .subscribe(res => {
                // alert("Assignment Name updated Successfully");
                const dialogRef = this.dialog.open(AlertdialogComponent, {
                  data: {
                    message: 'Assignment Name updated Successfully',
                    buttonText: {
                      cancel: 'Done'
                    }
                  },
                });
                dialogRef.afterClosed().subscribe(dialogResult => {
                  this.checkFlag = false;
                  this._location.back();
                });
              });
          } else {
            // alert("Assignment Name already present !");
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: 'Assignment Name already present !!',
                buttonText: {
                  cancel: 'Done'
                }
              },
            });
            dialogRef.afterClosed().subscribe(dialogResult => {
              this.checkFlag = false;
            });
          }
        });
    } else {
      this.scheduleService.updateScheduleNameDetails(this.employeekey, this.OrganizationID, this.scheduleDetails.BatchSchduleName, this.empKey, this.scheduleNameKey$, this.scheduleDetails.ScheduleDescription, startTime, endTime, this.scheduleDetails.Master_shiftID)
        .subscribe(res => {
          // alert("Assignment Name updated Successfully");
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'Assignment Name updated Successfully',
              buttonText: {
                cancel: 'Done'
              }
            },
          });
          dialogRef.afterClosed().subscribe(dialogResult => {
            this.checkFlag = false;
            this._location.back();
          });
        });
    }

  }
  ngOnInit() {

    //token starts....
    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();

    //token ends
    this.checkFlag = false;

    this.scheduleService
      .getAllEmpList(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.empList = data;
      });

    this.scheduleService
      .getScheduleDetailsbyID(this.scheduleNameKey$, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.scheduleDetails = data[0];
        this.empKey = data[0].EmployeeKey;
        this.schName = data[0].BatchSchduleName;
        this.scheduleDetails.checkBoxValue = false;
        var cur_time = new Date(Date.now());
        var timeValue1 = this.scheduleDetails.BatchScheduleTime;
        var test1 = timeValue1.split(":");
        var start = new Date(cur_time.getFullYear(), cur_time.getMonth(), cur_time.getDate(), test1[0], test1[1], 0);
        this.BatchScheduleTime = start;
        var timeValue2 = this.scheduleDetails.BatchScheduleEndTime;
        var test2 = timeValue2.split(":");
        this.BatchScheduleEndTime = new Date(cur_time.getFullYear(), cur_time.getMonth(), cur_time.getDate(), test2[0], test2[1], 0);

      });

    this.ReportServiceService.getShiftNameList(this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
      this.shiftdetails = data;
    });
  }
  goBack() {
    this._location.back();
  }
  deleteAssignName(BatchScheduleNameKey) {
    this.BatchScheduleNameKey = BatchScheduleNameKey;

    const message = `Are you sure !!  Do you want to delete`;
    const dialogData = new ConfirmDialogModel("DELETE", message);
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.checkFlag = true;
        this.scheduleService.deleteAssignmentName(this.BatchScheduleNameKey, this.employeekey, this.OrganizationID)
          .subscribe((data: any[]) => {
            // alert("Assignment Name deleted successfully");
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: 'Assignment Name deleted successfully',
                buttonText: {
                  cancel: 'Done'
                }
              },
            });
            dialogRef.afterClosed().subscribe(dialogResult => {
              this.checkFlag = false;
              this.loading = true;
              this._location.back();
            });
          });
      } else {
        this.loading = false;
        this.checkFlag = false;
      }
    });



  }

  // deleteAssignmentName() {
  //   this.checkFlag = true;
  //   this.scheduleService.deleteAssignmentName(this.BatchScheduleNameKey, this.employeekey, this.OrganizationID)
  //     .subscribe((data: any[]) => {
  //       alert("Assignment Name deleted successfully");
  //       this.checkFlag = false;
  //       this.loading = true;
  //       this._location.back();
  //     })
  // }
}
