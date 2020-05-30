import { Component, OnInit, Inject, OnDestroy, EventEmitter } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApiService } from '../shared/services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-game-modal',
  templateUrl: './create-game-modal.component.html',
  styleUrls: ['./create-game-modal.component.scss']
})
export class CreateGameModalComponent implements OnInit, OnDestroy {

  data: any = {}
  link
  playersList: Player[] = []
  subs: Subscription
  gameMaster: any = {}
  gameCreator: boolean
  toolTipValue = "Copy to clipboard"
  onStartGame = new EventEmitter();

  constructor(public ds: DataService, public as: ApiService, public dialogRef: MatDialogRef<CreateGameModalComponent>,
    @Inject(MAT_DIALOG_DATA) public game) {
    this.data = game.info
  }

  ngOnInit() {
    this.initData()
    this.subs = this.ds.gameState$.subscribe(param => {
      if (this.ds.isNotNull(param)) {
        if (param.players) {
          this.playersList = param.players
        }
      }
    });
    this.link = window.location.href

  }

  initData() {
    console.log(this.data)
    this.gameCreator = this.data.players.some(res => res.id == this.data.user.id && res.admin === true)
    this.playersList = this.data.players
    this.gameMaster = this.playersList.find(res => res.admin)
    console.log(this.gameMaster)
  }
  copyText(e) {
    const copyText: any = document.getElementById("text")
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
    this.toolTipValue = "Copied! ✅"

  }

  resetTooltip(e) {
    setTimeout(() => {
      this.toolTipValue = "Copy to clipboard"
    }, 100);
  }

  begin() {
    this.onStartGame.emit();
  }

  ngOnDestroy() {
    if (this.subs)
      this.subs.unsubscribe
  }

}
interface Player {
  name: string
  admin: boolean
}