import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { InventoryService } from '../../../../service/inventory.service';
import { Location } from '@angular/common';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';

@Component({
  selector: 'app-floor-type-edit',
  templateUrl: './floor-type-edit.component.html',
  styleUrls: ['./floor-type-edit.component.scss']
})
export class FloorTypeEDitComponent implements OnInit {
  flrTypeKey$: Object;
  flrType;
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

  constructor(private route: ActivatedRoute, private inventoryService: InventoryService, private router: Router, private _location: Location, private dst: DataServiceTokenStorageService, private dialog: MatDialog) {
    this.route.params.subscribe(params => this.flrTypeKey$ = params.FloorTypeKey);
  }

  updateFloorType(FloorTypeName) {
    this.checkFlag = true;
    if (!FloorTypeName || !FloorTypeName.trim()) {
      // alert("Please provide a FloorType Name");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please provide a FloorType Name',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
    } else {
      FloorTypeName = FloorTypeName.trim();
      this.inventoryService.checkForNewFloorType(FloorTypeName, this.employeekey, this.OrganizationID).subscribe((data: Array<any>) => {
        if (data.length > 0) {
          // alert("FloorType already present");
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'FloorType already present',
              buttonText: {
                cancel: 'Done'
              }
            },
          });
          this.checkFlag = false;
        }
        else {
          this.inventoryService.UpdateFloorType(FloorTypeName, this.flrTypeKey$, this.employeekey, this.OrganizationID).subscribe(res => {
            // alert("FloorType updated successfully");
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: 'FloorType updated successfully',
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
    this.inventoryService.EditFloorType(this.flrTypeKey$, this.OrganizationID).subscribe((data: any[]) => {
      this.flrType = data[0];
    });
  }
  goBack() {
    this._location.back();
  }
}
