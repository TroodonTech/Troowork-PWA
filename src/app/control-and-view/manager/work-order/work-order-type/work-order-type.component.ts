import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { workorder } from '../../../../model-class/work-order';
import { WorkOrderServiceService } from '../../../../service/work-order-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../../../dialog/confirmationdialog/confirmationdialog.component';

@Component({
  selector: 'app-work-order-type',
  templateUrl: './work-order-type.component.html',
  styleUrls: ['./work-order-type.component.scss']
})
export class WorkOrderTypeComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  pageno: Number = 1;
  items_perpage: Number = 25;
  showHide1: boolean;
  showHide2: boolean;
  pagination: Number;
  loading: boolean;// loading
  checkFlag;
  //decode token
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
  workorderTypeList;
  delete_WOType;
  wot_key;
  //special character restriction
  searchform: FormGroup;
  regexStr = '^[a-zA-Z0-9_ ]*$';
  @Input() isAlphaNumeric: boolean;
  constructor(private formBuilder: FormBuilder, private WorkOrderServiceService: WorkOrderServiceService, private el: ElementRef, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }
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
  //code for pagination
  previousPage() {
    this.pageno = +this.pageno - 1;
    this.WorkOrderServiceService
      .getall_workordertype(this.pageno, this.items_perpage, this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.workorderTypeList = data;
        if (this.pageno == 1) {
          this.showHide2 = true;
          this.showHide1 = false;
        } else {
          this.showHide2 = true;
          this.showHide1 = true;
        }
      });
  }

  nextPage() {
    this.pageno = +this.pageno + 1;
    this.WorkOrderServiceService
      .getall_workordertype(this.pageno, this.items_perpage, this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.workorderTypeList = data;
        this.pagination = +this.workorderTypeList[0].totalItems / (+this.pageno * (+this.items_perpage));
        if (this.pagination > 1) {
          this.showHide2 = true;
          this.showHide1 = true;
        }
        else {
          this.showHide2 = false;
          this.showHide1 = true;
        }
      });
  }
  //
  ngOnInit() {
    this.loading = true;
    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();
    this.checkFlag = false;
    this.WorkOrderServiceService
      .getall_workordertype(this.pageno, this.items_perpage, this.employeekey, this.OrganizationID)//service for gettig all workorder type on pageload
      .subscribe((data: any[]) => {
        this.workorderTypeList = data;
        this.loading = false;
        if (this.workorderTypeList[0].totalItems > this.items_perpage) {
          this.showHide2 = true;
          this.showHide1 = false;
        }
        else if (this.workorderTypeList[0].totalItems <= this.items_perpage) {
          this.showHide2 = false;
          this.showHide1 = false;
        }
      });
    this.searchform = this.formBuilder.group({
      searchworkordertype: ['', Validators.required]
    });
  }
  //function called on search
  searchWOType(key) {
    var value = key.trim();
    if (value.length >= 3)//if search key length>3 search service is called
    {
      this.WorkOrderServiceService
        .search_workordertype(this.OrganizationID, value)
        .subscribe((data: any[]) => {
          this.workorderTypeList = data;
          this.showHide2 = false;
          this.showHide1 = false;
        });
    }
    else if (value.length == 0)//if search key length=0 original table is returned
    {
      if ((value.length == 0) && (key.length == 0)) {
        this.loading = true;
      }
      this.WorkOrderServiceService//service for loading current table
        .getall_workordertype(this.pageno, this.items_perpage, this.employeekey, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.workorderTypeList = data;
          this.loading = false;
          if (this.workorderTypeList[0].totalItems > this.items_perpage) {
            this.showHide2 = true;
            this.showHide1 = false;
          }
          else if (this.workorderTypeList[0].totalItems <= this.items_perpage) {
            this.showHide2 = false;
            this.showHide1 = false;
          }
        });
    }

  }
  //function to assign value of current wot(for delete)
  deleteWOT(key) {
    this.wot_key = key;

    const message = `Are you sure !!  Do you want to delete`;
    const dialogData = new ConfirmDialogModel("DELETE", message);
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {

        this.loading = true;
        this.checkFlag = true;
        this.delete_WOType = {
          WorkorderTypeKey: this.wot_key,
          OrganizationID: this.OrganizationID
        };
        this.WorkOrderServiceService
          .DeleteWOT(this.delete_WOType).subscribe(() => {
            // alert("Work-order type deleted successfully");
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: 'Work-order type deleted successfully',
                buttonText: {
                  cancel: 'Done'
                }
              },
            });
            this.checkFlag = false;
            this.WorkOrderServiceService
              .getall_workordertype(this.pageno, this.items_perpage, this.employeekey, this.OrganizationID)
              .subscribe((data: any[]) => {
                this.workorderTypeList = data;
                this.loading = false;
                if (this.workorderTypeList[0].totalItems > this.items_perpage) {
                  this.showHide2 = true;
                  this.showHide1 = false;
                }
                else if (this.workorderTypeList[0].totalItems <= this.items_perpage) {
                  this.showHide2 = false;
                  this.showHide1 = false;
                }
              });

          });
      } else {
        this.loading = false;
        this.checkFlag = false;
      }
    });
  }
  //function to delete current workordertype key
  // deleteWOType() {
  //   this.loading = true;
  //   this.checkFlag = true;
  //   this.delete_WOType = {
  //     WorkorderTypeKey: this.wot_key,
  //     OrganizationID: this.OrganizationID
  //   };
  //   this.WorkOrderServiceService
  //     .DeleteWOT(this.delete_WOType).subscribe(() => {
  //       alert("Work-order type deleted successfully");
  //       this.checkFlag = false;
  //       this.WorkOrderServiceService
  //         .getall_workordertype(this.pageno, this.items_perpage, this.employeekey, this.OrganizationID)
  //         .subscribe((data: any[]) => {
  //           this.workorderTypeList = data;
  //           this.loading = false;
  //           if (this.workorderTypeList[0].totalItems > this.items_perpage) {
  //             this.showHide2 = true;
  //             this.showHide1 = false;
  //           }
  //           else if (this.workorderTypeList[0].totalItems <= this.items_perpage) {
  //             this.showHide2 = false;
  //             this.showHide1 = false;
  //           }
  //         });

  //     });
  // }

}
