import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { LoginService } from '../../../../service/login.service';
import { People } from '../../../../model-class/People';
import { PeopleServiceService } from '../../../../service/people-service.service';
import { Login } from '../../../../model-class/login';
import { HttpClient } from '@angular/common/http';
import { ConectionSettings } from '../../../../service/ConnectionSetting';

import { DataServiceTokenStorageService } from '../../../../service/DataServiceTokenStorage.service';
@Component({
  selector: 'app-admin-change-password',
  templateUrl: './admin-change-password.component.html',
  styleUrls: ['./admin-change-password.component.scss']
})
export class AdminChangePasswordComponent implements OnInit {
  currentPassword: String;
  newPassword: String;
  repeatPassword: String;
  passDetails: Login[];
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  isAuthenticated: boolean;
  Password: String;
  username: String;
  employeeKey$: Object;
  userRoleName$: Object;
  isSupervisor$: Object;
  UserLoginId: Number;
  managerMail: Object;
  userMail: Object;
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

  constructor(private loginService: LoginService, private route: ActivatedRoute, private router: Router, private peopleService: PeopleServiceService, private http: HttpClient, private dst: DataServiceTokenStorageService) {
    this.route.params.subscribe(params => this.employeeKey$ = params.EmployeeKey);
    this.route.params.subscribe(params => this.userRoleName$ = params.UserRoleName);
    this.route.params.subscribe(params => this.isSupervisor$ = params.IsSupervisor);
  }

  paswordchange() {
    this.checkFlag = true;
    if (!this.Password) {
      alert(" Enter new password"); this.checkFlag = false;
    } else if (!this.repeatPassword) {
      alert(" Enter retype password"); this.checkFlag = false;
    } else if (this.Password === this.newPassword) {
      alert("Current and new passwords are same."); this.checkFlag = false;
    }
    else if (this.newPassword != this.repeatPassword) {
      alert("New and retype password are not same."); this.checkFlag = false;
    } else {
      this.loginService
        .setPassword(this.username, this.newPassword, this.employeekey, this.UserLoginId, this.OrganizationID)
        .subscribe((data: Login[]) => {
          this.passDetails = data;
        });
      if (this.passDetails.length > 0) {
        this.peopleService.getUserEmail(this.username, this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
          this.checkFlag = false;
          this.managerMail = data[0].EmailID;
          this.userMail = data[0].newmail;

          if (this.userMail == null) {
            alert("Password Changed Successfully! Mail not send , Mail-Id not found !");
          } else {
            var message = 'Your Username is ' + this.username + ' and ' + 'Your Password is ' + this.newPassword + "                https://troowork.azurewebsites.net";

            const obj = {
              from: this.managerMail,
              to: this.userMail,
              subject: 'Login Credentials',
              text: message
            };
            const url = ConectionSettings.Url + "/sendmail";
            return this.http.post(url, obj)
              .subscribe(res => console.log('Mail Sent Successfully...'));
          }

        });
        this.router.navigate(['AdminDashboard', { outlets: { AdminOut: ['welcomePage'] } }]);
      }
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
    this.loginService
      .getUserPasswordDetails(this.employeekey, this.OrganizationID)
      .subscribe((data: Login[]) => {
        this.passDetails = data;
        this.Password = this.passDetails[0].Password;
        this.username = this.passDetails[0].UserId;
        this.UserLoginId = this.passDetails[0].UserLoginId;
      });
  }


  charValidation(event: any) {
    const patternChar = /[a-zA-Z 0-9~`!@#$%^&*()-_+=|}:;"',.?/{}]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !patternChar.test(inputChar)) {
      event.preventDefault();
    }
  }


}
