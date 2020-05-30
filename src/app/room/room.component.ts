import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../shared/services/web-socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService, CurrentUser } from '../shared/services/data.service';
import { ModalService } from '../shared/services/modal.service';
import { ApiService } from '../shared/services/api.service';
import { MatDialog } from '@angular/material';
import { CreateNameModalComponent } from '../create-name-modal/create-name-modal.component';
import { CreateGameModalComponent } from '../create-game-modal/create-game-modal.component';
import { Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  messageList: Message[] = []
  roomCode
  begin: boolean
  gameOn: boolean
  currentGame: Game
  user: CurrentUser
  shareDialogRef
  gameStartedSubs: Subscription
  isAdmin: boolean
  msgToSend
  constructor(private wsService: WebSocketService, public activeRoute: ActivatedRoute, public ds: DataService,
    public ms: ModalService, public as: ApiService, public router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    // console.log(encodeURIComponent(this.ds.encrypt('lobby')))
    //U2FsdGVkX1955Lx7bdolLP1T0Ir8Urd%2FN6%2B4xBAKCzM%3D
    this.roomCode = this.ds.decrypt(decodeURIComponent(this.activeRoute.snapshot.params.code))
    console.log(this.roomCode)
    this.as.getGame(this.activeRoute.snapshot.params.code).subscribe(res => {
      this.user = this.ds.getCurrentUser()
      if (res.exist) {
        this.currentGame = res.game
        if (this.user.gameAdmin && encodeURIComponent(this.user.gameAdmin) === this.activeRoute.snapshot.params.code) {
          this.isAdmin = this.currentGame.players.some(res => res.id == this.user.id && res.admin === true)
        }
        if (this.ds.isEmpty(this.user)) {
          this.createNameAndJoinDialog({ game: this.currentGame })
        } else {
          this.enableGameListening()
          this.join()
        }
        this.begin = true
      } else {
        if (encodeURIComponent(this.user.gameAdmin) === this.activeRoute.snapshot.params.code) {
          this.user.gameAdmin = ""
          this.ds.setCurrentUser(this.user)
        }
        this.router.navigate(['/'])
      }
    })

  }

  createNameAndJoinDialog(pData) {
    const dialogRef = this.dialog.open(CreateNameModalComponent, {
      // panelClass: 'custom-dialog-container',
      autoFocus: false,
      maxWidth: '90vw',
      minWidth: '30%',
      minHeight: '0px',
      data: pData
    });
    dialogRef.componentInstance.onJoin.subscribe(() => {
      this.user = this.ds.getCurrentUser()
      this.enableGameListening()
      this.join()
    });
  }

  shareGameDialog(pData) {
    this.shareDialogRef = this.dialog.open(CreateGameModalComponent, {
      // panelClass: 'custom-dialog-container',
      autoFocus: false,
      maxWidth: '500px',
      width: '95%',
      minHeight: '0px',
      data: { info: pData }
    });

    this.shareDialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.router.navigate(['/'])
        this.ds.afterRouteSwitch()
      }
      console.log(`Game Dialog result: ${result}`); // Pizza!
    });
    this.shareDialogRef.componentInstance.onStartGame.subscribe(() => {
      this.play()
      this.wsService.startGame({ room: this.currentGame.id })
    });
  }

  enableGameListening() {
    this.wsService.connecting()
    if (!this.isAdmin)
      this.gameStartedSubs = this.wsService.gameStarted()
        .subscribe((data: any) => {
          if (data.state && !this.gameOn) {
            this.shareDialogRef.close(true)
            this.play()
            this.gameStartedSubs.unsubscribe()
          }
        });

    this.wsService.newUserJoined()
      .subscribe((data: any) => {
        if (this.gameOn) {
          // this.messageList.push(data)
        } else {
          this.ds.updatesGameState({
            players: data.game.players,
          })
        }
      });

    // this.wsService.userLeftRoom()
    //   .subscribe(data => {
    //     if (this.gameOn) {
    //       this.messageArray.push(data)
    //     }
    //   });

    this.wsService.newMessageReceived()
      .subscribe((data: any) => {
        if (this.gameOn) {
          data.message.mine = this.user.id === data.message.user.id
          this.messageList.push(data.message)
          this.scrollToBottom()
        }
      });
  }

  join() {
    if (!this.currentGame.players.some(res => res.id === this.user.id)) {
      this.as.savePlayer({ ...this.user, idRoom: this.currentGame.id }).subscribe(res => {
        this.currentGame.players.push({ id: this.user.id, name: this.user.name, admin: false })
        this.wsService.joinRoom({ room: this.currentGame.id, user: this.user.name })
        if (!this.currentGame.state) {
          this.shareGameDialog({ ...this.currentGame, user: this.user })
        } else {
          this.play()
        }
      })
    } else {
      this.wsService.joinRoom({ room: this.currentGame.id, user: this.user.name })
      if (!this.currentGame.state) {
        this.shareGameDialog({ ...this.currentGame, user: this.user })
      } else {
        this.play()
      }
    }

  }

  play() {
    if (!this.gameOn) {
      this.gameOn = true
      console.log('game on')
      this.initDataGame()
    }
  }

  initDataGame() {
    setTimeout(() => {
      this.scrollToBottom()
    }, 10);
    this.as.getMessages(this.activeRoute.snapshot.params.code).subscribe(res => {
      this.messageList = this.formatMessages(res).sort((a, b) => a.date - b.date);
    })
    // this.as.getFakeMessages().subscribe(res => {
    //   this.messageList = this.formatMessages(res).sort((a, b) => a.date - b.date);
    // })
  }

  formatMessages(res) {
    return res.msgList.map(obj => ({ ...obj, mine: this.user.id === obj.user.id }))
  }
  sendMsg() {
    if (this.ds.isNotNull(this.msgToSend) && $.trim(this.msgToSend) !== '') {
      const messageToSend = {
        "room": this.currentGame.id,
        "message": {
          "user": {
            "id": this.user.id,
            "name": this.user.name
          },
          "date": Date.now().toString(),
          "message": this.msgToSend
        }
      }
      this.wsService.sendMessage(messageToSend)
      this.msgToSend = ""
      this.scrollToBottom()
    }
  }

  scrollToBottom() {
    $(".messages").animate({ scrollTop: $(document).height() * 100 }, "fast");
  }

}

interface Game {
  id: string;
  name: any;
  state: boolean;
  actif: boolean;
  players: User[];
  messages: Message[];
}
interface User {

  id: any;
  name: any;
  admin?: boolean;

}
interface Message {
  user: User,
  message: 'has joined this room.',
  date: string
}