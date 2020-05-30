import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DataService } from './data.service';
import { CreateNameModalComponent } from 'src/app/create-name-modal/create-name-modal.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(public dialog: MatDialog, public ds: DataService, public router: Router) { }


  createNameDialog() {
    this.openDialogName(null)
  }

  editNameDialog(pName) {
    this.openDialogName({ name: pName })
  }

  openDialogName(pData) {
    const dialogRef = this.dialog.open(CreateNameModalComponent, {
      // panelClass: 'custom-dialog-container',
      autoFocus: false,
      maxWidth: '90vw',
      minWidth: '30%',
      minHeight: '0px',
      data: pData
    });
  }
}
