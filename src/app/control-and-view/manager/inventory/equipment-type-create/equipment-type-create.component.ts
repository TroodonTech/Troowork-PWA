import { Component, OnInit } from '@angular/core';
import { Inventory } from '../../../../model-class/Inventory';
import { InventoryService } from '../../../../service/inventory.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../../../dialog/confirmationdialog/confirmationdialog.component';

@Component({
  selector: 'app-equipment-type-create',
  templateUrl: './equipment-type-create.component.html',
  styleUrls: ['./equipment-type-create.component.scss']
})
export class EquipmentTypeCreateComponent implements OnInit {
  dept: Inventory[];
  EquipmentTypeName: String;
  EquipmentTypeDescription: String;

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;

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

  constructor(private fb: FormBuilder, private inventoryServ: InventoryService, private router: Router, private _location: Location, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }

  addEquipmentType() {
    this.checkFlag = true;
    if (!this.EquipmentTypeName || !this.EquipmentTypeName.trim()) {
      // alert("Please provide a Equipment Type");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please provide a Equipment Type!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
    } else if (!this.EquipmentTypeDescription || !this.EquipmentTypeDescription.trim()) {
      // alert("Please provide a Equipment Type Description");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please provide a Equipment Type Description!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
    } else {
      this.EquipmentTypeName = this.EquipmentTypeName.trim();
      this.EquipmentTypeDescription = this.EquipmentTypeDescription.trim();
      this.inventoryServ.checkForNewEquipmentType(this.EquipmentTypeName, this.employeekey, this.OrganizationID).subscribe((data: Inventory[]) => {
        this.dept = data;
        if (this.dept[0].count > 0) {
          // alert("Equipment Type already present");
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'Equipment Type already present!',
              buttonText: {
                cancel: 'Done'
              }
            },
          });
          this.checkFlag = false;
        }
        else if (this.dept[0].count == 0) {
          this.inventoryServ.addEquipmentType(this.EquipmentTypeName, this.EquipmentTypeDescription, this.employeekey, this.OrganizationID).subscribe(res => {
            // alert("Equipment Type Created Successfully");
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: 'Equipment Type Created Successfully',
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
  }
  goBack() {
    this._location.back();
  }
}
