import { Component, OnInit } from '@angular/core';
import { SchedulingService } from '../../../../service/scheduling.service';
import { ActivatedRoute } from "@angular/router";

import { Location } from '@angular/common';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';

@Component({
  selector: 'app-edit-master-shifts',
  templateUrl: './edit-master-shifts.component.html',
  styleUrls: ['./edit-master-shifts.component.scss']
})
export class EditMasterShiftsComponent implements OnInit {
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;

  shiftDetails;
  shiftKey$: Object;
  shftNme;
  checkFlag;
  supervisorlist;

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
  constructor(private scheduleService: SchedulingService, private route: ActivatedRoute, private _location: Location, private dst: DataServiceTokenStorageService, private dialog: MatDialog) {
    this.route.params.subscribe(params => this.shiftKey$ = params.masterShiftID);
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
      .getMasterShiftDetails(this.shiftKey$, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.shiftDetails = data[0];
        this.shftNme = data[0].ShiftName;
      });

    this.scheduleService.getallsupervisorlist_shift(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.supervisorlist = data;
      });

  }
  goBack() {
    this._location.back();
  }

  updateShift() {
    this.checkFlag = true;
    if (!(this.shiftDetails.ShiftName) || !(this.shiftDetails.ShiftName.trim())) {
      // alert("Shift Name can't be empty.");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: "Shift Name can't be empty.",
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return false;
      });
    }
    this.shiftDetails.ShiftName = this.shiftDetails.ShiftName.trim();
    if (this.shftNme != this.shiftDetails.ShiftName) {
      this.scheduleService
        .checkForDuplicateMasterShiftName(this.shiftKey$, this.shiftDetails.ShiftName, this.OrganizationID)
        .subscribe((data: any[]) => {
          if (data[0].count == 0) {
            this.scheduleService
              .udpateMasterShiftDetails_supervisor(this.shiftKey$, this.shiftDetails.ShiftName, this.employeekey, this.OrganizationID, this.shiftDetails.SupervisorEmployeeKey)
              .subscribe(res => {
                // alert("Shift Name updated Successfully");
                const dialogRef = this.dialog.open(AlertdialogComponent, {
                  data: {
                    message: 'Shift Name updated Successfully!',
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
          else {
            // alert("Shift Name already present... :(");
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: 'Shift Name already present !',
                buttonText: {
                  cancel: 'Done'
                }
              },
            });
            dialogRef.afterClosed().subscribe(dialogResult => {
              this.checkFlag = false;
              return false;
            });
          }

        });
    } else {
      this.scheduleService
        .udpateMasterShiftDetails_supervisor(this.shiftKey$, this.shiftDetails.ShiftName, this.employeekey, this.OrganizationID, this.shiftDetails.SupervisorEmployeeKey)
        .subscribe(res => {
          this.checkFlag = false;
          this._location.back();
        });
    }
  }
}
