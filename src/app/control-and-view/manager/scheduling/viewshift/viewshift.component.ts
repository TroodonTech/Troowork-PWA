import { Component, OnInit, HostListener, Input, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { SchedulingService } from '../../../../service/scheduling.service';
// import { MatDialog } from '@angular/material/dialog';
// import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
// import { ConfirmationdialogComponent, ConfirmDialogModel } from '../../../dialog/confirmationdialog/confirmationdialog.component';

@Component({
  selector: 'app-viewshift',
  templateUrl: './viewshift.component.html',
  styleUrls: ['./viewshift.component.scss']
})
export class ViewshiftComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  grpName1;
  shiftdetails;
  delete_shiftKey;
  grpID;
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
  // , private dialog: MatDialog
  constructor(private scheduleServ: SchedulingService, private dst: DataServiceTokenStorageService) { }

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

    this.scheduleServ.getShifts(this.employeekey, this.OrganizationID).subscribe((data: any[]) => {

      this.shiftdetails = data;

    });
  }
  // deleteShiftPass(Idemployeeshift) {
  //   this.delete_shiftKey = Idemployeeshift;
  // }
  // deleteShift() {
  //   this.scheduleServ.removeEmployeeShift(this.delete_shiftKey, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
  //     alert("Group Name deleted successfully");
  //     this.scheduleServ.getShifts(this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
  //       this.shiftdetails = data;
  //     });
  //   });
  // }

  // changeDisable(indexVal) {
  //   this.grpID = indexVal;
  //   this.grpName1 = this.shiftdetails[indexVal].Description;
  // }


  // cancelGrpName() {
  //   this.grpID = -1;

  //   this.scheduleServ.getShifts(this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
  //     this.shiftdetails = data;
  //   });
  // }

  // updateGrpName(grpName, grpnameid) {

  //   if (this.grpName1 == grpName) {
  //     this.grpID = -1;
  //     this.scheduleServ.getShifts(this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
  //       this.shiftdetails = data;
  //     });
  //   } else {
  //     this.scheduleServ.checkForEmpGrpDuplicate(grpName, this.OrganizationID).subscribe((data: any[]) => {
  //       if (data.length == 0) {
  //         this.scheduleServ.updateShiftDetails(grpnameid, grpName, this.OrganizationID, this.employeekey).subscribe((data: any[]) => {
  //           alert("Group Name updated Successfully");
  //           this.grpID = -1;
  //           this.scheduleServ.getShifts(this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
  //             this.shiftdetails = data;
  //           });
  //         });
  //       } else {
  //         alert("Group Name already exists");
  //         return;
  //       }
  //     });
  //   }
  // }
}
