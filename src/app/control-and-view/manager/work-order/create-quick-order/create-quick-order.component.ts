import { Component, OnInit } from '@angular/core';
import { workorder } from '../../../../model-class/work-order';
import { WorkOrderServiceService } from '../../../../service/work-order-service.service';
import { ResponsiveService } from 'src/app/service/responsive.service';

import { Router } from "@angular/router";
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
@Component({
  selector: 'app-create-quick-order',
  templateUrl: './create-quick-order.component.html',
  styleUrls: ['./create-quick-order.component.scss']
})
export class CreateQuickOrderComponent implements OnInit {
  EmployeeOption: workorder[];
  facilitylist: workorder[];
  emp_key: number;
  org_id: number;
  marked = false;
  prioritylist: workorder[];
  EmployeeKey;
  WorkorderNotes;
  FacilityKey;
  PriorityKey;
  isPhotoRequired;
  createworkorder;
  wot;
  notes;
  facilityString;
  zone;
  eqp_key;
  shift;
  priority;
  isReccuring;
  isrecurring; // for setting bit value 1 or 0
  startDT;
  endDT;
  workTime;
  dailyRecc_gap; // dailyreccuringGap
  is_PhotoRequired;
  is_BarcodeRequired;
  occurenceinstance;

  intervaltype;
  repeatinterval;
  occursonday;

  workorderCreation;
  role: String;
  name: String;
  IsSupervisor: Number;
  isMobile: any;
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
  constructor(private router: Router, private responsiveService: ResponsiveService, private WorkOrderServiceService: WorkOrderServiceService, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }
  //Function for converting date from GMT to yyyy/mm/dd format
  convert_DT(str) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }
  //
  toggleVisibility(e) {
    if (e.target.checked) {
      this.marked = true;
    } else {
      this.marked = false;
    }
  }
  //function for creating quick work order
  saveQuickWorkOrder() {
    this.checkFlag = true;
    if (!(this.EmployeeKey)) {
      // alert("Please select employee!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please select employee!!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
      });
    } else if (!(this.FacilityKey)) {
      // alert("Please select building!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please select building!!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
      });
    }
    else if (!(this.WorkorderNotes)) {
      // alert("Please enter work-order notes!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please enter work-order notes!!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
      });
    } else {

      this.wot = - 1;
      this.startDT = this.convert_DT(new Date());
      var d = new Date();
      var datetext = d.toTimeString();
      datetext = datetext.split(' ')[0];
      this.workTime = datetext;
      this.is_BarcodeRequired = 0;

      if (this.WorkorderNotes) {
        this.notes = this.WorkorderNotes.trim();
      } else {
        this.notes = null;
      }


      var facilityString;
      if (this.FacilityKey) {
        facilityString = this.FacilityKey;
      }

      if (this.EmployeeKey) {
        this.emp_key = this.EmployeeKey;
      } else {
        this.emp_key = - 1;
      }


      if (this.PriorityKey) {
        this.priority = this.PriorityKey;
      } else {
        this.priority = - 1;
      }
      if (this.isPhotoRequired) {
        this.is_PhotoRequired = 1;
      } else {
        this.is_PhotoRequired = 0;
      }

      this.createworkorder = {

        workorderkey: - 99,
        workordertypekey: - 1,
        equipmentkey: - 1,
        roomkeys: '-1',
        facilitykeys: facilityString,
        floorkeys: '-1',
        zonekeys: '-1',
        roomtypekeys: '-1',
        employeekey: this.emp_key,
        priority: this.priority,
        fromdate: this.startDT,
        todate: this.startDT,
        intervaltype: '0',
        repeatinterval: 1,
        occursonday: null,
        occursontime: this.workTime,
        occurstype: null,
        workordernote: this.notes,
        isbar: this.is_BarcodeRequired,
        isphoto: this.is_PhotoRequired,
        metaupdatedby: this.emp_key,
        OrganizationID: this.org_id

      };

      this.WorkOrderServiceService
        .addQuickWorkOrder(this.createworkorder)
        .subscribe(res => {
          // alert("Work-order created successfully");
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'Work-order created successfully',
              buttonText: {
                cancel: 'Done'
              }
            },
          });
          dialogRef.afterClosed().subscribe(dialogResult => {
            this.checkFlag = false;
            this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewWorkOrder'] } }]);
          });
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
    this.emp_key = this.dst.getEmployeekey();
    this.org_id = this.dst.getOrganizationID();
    //setting default dropdown values to select
    this.FacilityKey = "";
    this.EmployeeKey = "";
    this.PriorityKey = "";
    this.checkFlag = false;
    this.WorkOrderServiceService//service for getting employee names
      .getallEmployee(this.emp_key, this.org_id)
      .subscribe((data: any[]) => {
        this.EmployeeOption = data;
      });
    this.WorkOrderServiceService//service for getting building names
      .getallFacility(this.emp_key, this.org_id)
      .subscribe((data: any[]) => {
        this.facilitylist = data;
      });
    this.WorkOrderServiceService//service for getting priority list
      .getallPriority(this.org_id)
      .subscribe((data: any[]) => {
        this.prioritylist = data;
      });
    this.onResize();
    this.responsiveService.checkWidth();
  }
  onResize() {
    this.responsiveService.getMobileStatus().subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }
}
