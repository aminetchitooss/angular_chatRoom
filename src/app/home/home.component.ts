import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../shared/services/data.service';
import { ApiService } from '../shared/services/api.service';
import { ModalService } from '../shared/services/modal.service';
import { WebSocketService } from '../shared/services/web-socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public router: Router, public ds: DataService, public as: ApiService, public ms: ModalService, private wsService: WebSocketService) { }
  listCaroussel = [
    "assets/images/player.jpg",
    "assets/images/player2.jpg",
    "assets/images/player3.jpg",
    "assets/images/player4.jpg",
    "assets/images/player5.jpg",
    "assets/images/player6.jpg"
  ]
  gameName
  isNotAdmin = true
  ngOnInit() {
    setTimeout(() => {
      if (document.getElementsByClassName('carousel-item')[0])
        document.getElementsByClassName('carousel-item')[0].classList.add("active");
    }, 10);
    const vUser = this.ds.getCurrentUser()
    this.isNotAdmin = this.ds.isNull(vUser.gameAdmin)
    if (!vUser.name && this.router.url.split("home").length > 1) {
      this.ms.createNameDialog()
    }
  }

  createGame() {
    const vUser = this.ds.getCurrentUser()
    if (!vUser.name) {
      this.ms.createNameDialog()
    }
    else if (vUser.gameAdmin) {
      this.ds.afterRouteSwitch()
      this.router.navigate(['room/' + encodeURIComponent(vUser.gameAdmin)])
    }
    else {
      if (this.ds.isNotNull(this.gameName))
        this.as.createGame(this.gameName).subscribe(res => {
          if (!res.error) {
            const vUser = this.ds.getCurrentUser()
            vUser.gameAdmin = res.id
            this.ds.setCurrentUser(vUser)
            console.log(encodeURIComponent(res.id))
            this.ds.afterRouteSwitch()
            // this.wsService.connecting()
            // this.wsService.joinRoom({ room: res.id, user: vUser.name })
            this.router.navigate(['room/' + encodeURIComponent(res.id)])
          } else {
            this.ds.showError(res.error)
          }
        })
    }
  }

  // createNameDialog(pData) {
  //   const dialogRef = this.dialog.open(CreateNameModalComponent, {
  //     // panelClass: 'custom-dialog-container',
  //     autoFocus: false,
  //     maxWidth: '90vw',
  //     minWidth: '30%',
  //     minHeight: '0px',
  //     data: pData
  //   });
  //   dialogRef.componentInstance.onJoin.subscribe(() => {
  //     this.user = 
  //   });
  // }

}
