import { Injectable, EventEmitter } from "@angular/core";

import { LoggingService } from "./logging.service";
@Injectable()
export class AccountsService{
    accounts = [
        {
          name: 'Master Account',
          status: 'active'
        },
        {
          name: 'Testaccount',
          status: 'inactive'
        },
        {
          name: 'Hidden Account',
          status: 'unknown'
        }
      ];

    constructor(private loggingService: LoggingService){

    }

    statusUpdated = new EventEmitter<string>();


    addAccount(name: string,status: string){
        this.accounts.push({name,status });
        this.loggingService.logStatusChange(status);
    }

    updateSatus(id: number, status: string){
        this.accounts[id].status = status;
        this.loggingService.logStatusChange(status);
    }
}

