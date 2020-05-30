import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../shared/services/api.service';
import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'app-create-name-modal',
  templateUrl: './create-name-modal.component.html',
  styleUrls: ['./create-name-modal.component.scss']
})
export class CreateNameModalComponent implements OnInit {

  newName
  name
  data
  onJoin = new EventEmitter();

  constructor(public ds: DataService, public as: ApiService, public dialogRef: MatDialogRef<CreateNameModalComponent>,
    @Inject(MAT_DIALOG_DATA) public response) {
    this.name = this.ds.isNotNull(response) ? response.name : null
    this.data = response
  }
  ngOnInit() {
  }

  saveName() {
    const nameToSave = this.newName + '_' + Date.now()
    const vUser = this.ds.getCurrentUser()
    vUser.name = nameToSave.split('_')[0]
    vUser.id = nameToSave.split('_')[1]
    this.ds.setCurrentUser(vUser)
    this.dialogRef.close()
    if (this.data && this.data.game)
    this.onJoin.emit();
  }
}
