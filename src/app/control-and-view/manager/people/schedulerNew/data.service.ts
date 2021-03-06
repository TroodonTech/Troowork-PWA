import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DayPilot } from 'daypilot-pro-angular';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class DataService {
  newtype = 'Month';
  expand: any[];
  expandFlag;
  focusEmp: number = 0;
  passDate = DayPilot.Date.today();
  resources: any[] = [
    {
      name: 'Employee1', id: 'GA', "expanded": true, children: [
        { name: 'Resource 1', id: 'R1' },
        { name: 'Resource 2', id: 'R2' }
      ]
    },
    // { name: 'Employee2', id: 'GB',"expanded": true, children: [
    //   { name: 'Resource 3', id: 'R3'},
    //   { name: 'Resource 4', id: 'R4'}
    // ]},
    // { name: 'Employee3', id: 'GC',"expanded": true, children: [
    //   { name: 'Resource 3', id: 'R5'},
    //   { name: 'Resource 4', id: 'R6'}
    // ]}
  ];

  events: any[] = [
    {
      id: "1",
      resource: "R1",
      start: "2019-06-19",
      end: "2019-06-19",
      text: "Event 1",
      scheduleName: "Schedule Manager1",
      backColor: "blue"
    }
  ];

  constructor(private http: HttpClient) {
  }

  getEvents(from: DayPilot.Date, to: DayPilot.Date): Observable<any[]> {

    // simulating an HTTP request
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.events);
      }, 200);
    });

    // return this.http.get("/api/events?from=" + from.toString() + "&to=" + to.toString());
  }

  getResources(): Observable<any[]> {

    // simulating an HTTP request
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.resources);
      }, 200);
    });

    // return this.http.get("/api/resources");
  }

  createEvent(data: CreateEventParams): Observable<EventData> {
    let e: EventData = {
      start: data.start,
      end: data.end,
      resource: data.resource,
      id: DayPilot.guid(),
      text: data.text,
      ScheduleNameKey: data.ScheduleNameKey,
      ScheduleName: data.ScheduleName,
      backColor: "White",
      moveDisabled: false,
      bubbleHtml: data.text
    };

    return new Observable(observer => {
      setTimeout(() => {
        observer.next(e);
      }, 200);
    });

    //return this.http.post("/api/events/create", data);
  }

  updateEvent(data: DayPilot.Event): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ result: "OK" });
      }, 200);
    });
  }
  setData(type, Date) {
    this.newtype = type;
    this.passDate = Date;
  }

  getType() {
    let temp = this.newtype;
    return temp;
  }
  getDate() {
    let temp = this.passDate;
    return temp;
  }

  setExpandFlag() {
    this.expandFlag = 1;
  }
  setExpandFlagNewComp(val) {
    this.expandFlag = val;
  }
  getExpandData() {
    return this.expand;
  }

  setExpandData(id, flag) {
    this.expand.push({ ID: id, Flag: flag });
  }
  clearExpandVal() {
    if (!(this.expandFlag)) {
      this.expandFlag = 0;
      this.expand = [];
    } else if (this.expandFlag == 0 || this.expandFlag == 1) {
      // this.expandFlag = 0;
      this.expand = [];
    } else if (this.expandFlag > 1) {

    }

    return this.expandFlag;
  }

  getFocusEmp() {
    return this.focusEmp;
  }

  setFocusEmp(focusEmp) {
    this.focusEmp = focusEmp;
  }
}


export interface CreateEventParams {
  start: string;
  end: string;
  text: string;
  resource: string | number;
  ScheduleNameKey: string;
  ScheduleName: string;
  backColor: string;
  moveDisabled: boolean;
  bubbleHtml: string;
}

export interface UpdateEventParams {
  id: string | number;
  start: string;
  end: string;
  text: string;
  resource: string | number;
  ScheduleNameKey: string;
  ScheduleName: string;
  backColor: string;
  moveDisabled: boolean;
  bubbleHtml: string;
}

export interface EventData {
  id: string | number;
  start: string;
  end: string;
  text: string;
  resource: string | number;
  ScheduleNameKey: string;
  ScheduleName: string;
  backColor: string;
  moveDisabled: boolean;
  bubbleHtml: string;
}
