import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { WorkOrderServiceService } from '../../../../service/work-order-service.service';


@Component({
  selector: 'app-view-interval-types',
  templateUrl: './view-interval-types.component.html',
  styleUrls: ['./view-interval-types.component.scss']
})
export class ViewIntervalTypesComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  EmployeeKey;
  curDate;
  interval;

  public convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

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

  constructor(private WorkOrderServiceService: WorkOrderServiceService, private dst: DataServiceTokenStorageService) { }

  ngOnInit() {

    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();

    this.curDate = this.convert_DT(new Date(Date.now()));
    this.WorkOrderServiceService.getAllIntervalTypes(this.OrganizationID)
      .subscribe((data: any[]) => {
        this.interval = data;
      });
  }


}
