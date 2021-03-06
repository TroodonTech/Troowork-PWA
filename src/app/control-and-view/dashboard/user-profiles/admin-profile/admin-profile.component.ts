import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../service/login.service';
import { Login } from '../../../../model-class/login';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { ConectionSettings } from '../../../../service/ConnectionSetting';
import { DataServiceTokenStorageService } from '../../../../service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
const url = ConectionSettings.Url + '/imgupload';
@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {
  profile: Login[];
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  isAuthenticated: boolean;
  addUrl;
  idimageupload;
  image;


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
  constructor(private loginService: LoginService, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }
  public uploader: FileUploader = new FileUploader({ url: '', itemAlias: 'photo' });



  ngOnInit() {
    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();

    this.loginService
      .getUserProfileDetails(this.employeekey, this.OrganizationID)
      .subscribe((data: Login[]) => {
        this.profile = data;
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
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.loginService.getimage(this.employeekey, this.OrganizationID, this.idimageupload)
          .subscribe((data: any[]) => {
            if (data.length > 0) {
              this.image = data[0].FileName;
            }
            else {
              this.image = null;
            }

          });
      });
    };
    this.loginService.getimage(this.employeekey, this.OrganizationID, this.idimageupload)
      .subscribe((data: any[]) => {
        if (data.length > 0) {
          this.image = data[0].FileName;
        }
        else {
          this.image = null;
        }
      });

  }
  ImgUpload() {
    // if (!(this.profile)) {
    //   alert("Please choose Document Folder");
    //   return;
    // }
    this.addUrl = '?empkey=' + this.employeekey + '&OrganizationID=' + this.OrganizationID;
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.url = url + this.addUrl;
    }
    this.uploader.uploadAll();
    this.loginService.getimage(this.employeekey, this.OrganizationID, this.idimageupload)
      .subscribe((data: any[]) => {
        this.image = data[0].FileName;
      });

  }
}
