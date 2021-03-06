import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { People } from '../../../../model-class/People';
import { PeopleServiceService } from '../../../../service/people-service.service';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../../../dialog/confirmationdialog/confirmationdialog.component';


@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.scss']
})
export class EventViewComponent implements OnInit {

  searchform: FormGroup;
  eventType: People[];
  ActionKey: Number;
  ActionTypeKey: Number;
  eventTypeList;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  page: Number = 1;
  count: Number = 25;
  editQuestions;

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


  //validation starts ..... @rodney
  regexStr = '^[a-zA-Z0-9_ ]*$';
  @Input() isAlphaNumeric: boolean;
  constructor(private formBuilder: FormBuilder, private peopleServ: PeopleServiceService, private el: ElementRef, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }
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

  //validation ends ..... @rodney

  deleteEventValuePass(actionKey, actiontypeKey) {
    this.ActionKey = actionKey;
    this.ActionTypeKey = actiontypeKey;
    const message = `Are you sure !!  Do you want to delete`;
    const dialogData = new ConfirmDialogModel("DELETE", message);
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.checkFlag = true;
        this.peopleServ
          .DeleteEventType(this.ActionKey, this.ActionTypeKey, this.OrganizationID).subscribe(res => {
            // alert('Successfully Deleted !');
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: 'Successfully Deleted ',
                buttonText: {
                  cancel: 'Done'
                }
              },
            });
            dialogRef.afterClosed().subscribe(dialogResult => {
              this.checkFlag = false;
              this.peopleServ
                .getEventTypeList(this.page, this.count, this.employeekey, this.OrganizationID)
                .subscribe((data: People[]) => {
                  this.eventType = data;
                });
            });
          });
      } else {
        this.checkFlag = false;
      }
    });
  }


  // deleteEventType() {
  //   this.checkFlag = true;
  //   this.peopleServ
  //     .DeleteEventType(this.ActionKey, this.ActionTypeKey, this.OrganizationID).subscribe(res => {
  //       alert('Successfully Deleted !');
  //       this.checkFlag = false;
  //       this.peopleServ
  //         .getEventTypeList(this.page, this.count, this.employeekey, this.OrganizationID)
  //         .subscribe((data: People[]) => {
  //           this.eventType = data;
  //         });
  //     });

  // }

  ngOnInit() {
    this.checkFlag = false;
    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();
    this.searchform = this.formBuilder.group({
      SearchMeetingTraining: ['', Validators.required]
    });


    this.peopleServ
      .getEventTypeList(this.page, this.count, this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.eventType = data;
        this.eventTypeList = data;
      });

  }
  cancelTemplateDetails() {
    this.editQuestions = -1;
    this.peopleServ
      .getEventTypeList(this.page, this.count, this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.eventType = data;
      });
  }
  UpdateEventDetais(index1, ActionType, Action, Description, ActionKey, ActionTypeKey) {

    if (!ActionType || !ActionType.trim()) {
      // alert("Please enter an event type");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please enter an event type!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return;
      });
      return;
    }
    if (!Action || !Action.trim()) {
      // alert("Please enter an event name");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please enter an event name !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return;
      });
      return;
    }
    if (ActionType) {
      ActionType = ActionType.trim();
    }
    if (Action) {
      Action = Action.trim();
    }
    if (Description) {
      Description = Description.trim();
    }
    this.peopleServ.checkEventDuplicateForEdit(ActionType, Action, ActionKey, ActionTypeKey, this.OrganizationID).subscribe((data: any[]) => {
      if (data[0].count == 0) {
        this.peopleServ.UpdateEventType(ActionType, Action, Description, ActionKey, ActionTypeKey, this.employeekey, this.OrganizationID).
          subscribe(() => {
            // alert('Successfully Updated !');
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: 'Successfully Updated',
                buttonText: {
                  cancel: 'Done'
                }
              },
            });
            dialogRef.afterClosed().subscribe(dialogResult => {

              this.peopleServ
                .getEventTypeList(this.page, this.count, this.employeekey, this.OrganizationID)
                .subscribe((data: People[]) => {
                  this.eventType = data;
                  this.editQuestions = -1;
                });
            });
          });
      }
      else {
        // alert("Entered event already exists...!!!");
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: 'Entered event already exists...!!!',
            buttonText: {
              cancel: 'Done'
            }
          },
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          return false;
        });

      }
    });
    // }
    // else {
    //   this.peopleServ
    //     .getEventTypeList(this.page, this.count, this.employeekey, this.OrganizationID)
    //     .subscribe((data: People[]) => {
    //       this.eventType = data;
    //       this.editQuestions = -1;
    //     });
    // }

  }

}
