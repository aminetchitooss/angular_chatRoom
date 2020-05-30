import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public ds: DataService, public http: HttpClient) { }
  public URI = environment.uri;


  createGame(pGameName): Observable<any> {
    const vUrl = this.URI + "/createGame"
    const vUser = this.ds.getCurrentUser()
    return this.postService(vUrl, { name: vUser.name, id: vUser.id, gameName: pGameName }).pipe(map((res) => res), catchError(res => this.handleError(res)))
  }

  getMessages(pGameId): Observable<any> {
    const vUrl = this.URI + "/gameMessages/" + pGameId
    return this.getService(vUrl).pipe(map((res) => res), catchError(res => this.handleError(res)))
  }

  getGame(pGameId): Observable<any> {
    const vUrl = this.URI + "/game/" + pGameId
    return this.getService(vUrl).pipe(map((res) => res), catchError(res => this.handleError(res)))
  }

  savePlayer(body): Observable<any> {
    const vUrl = this.URI + "/savePlayer"
    return this.postService(vUrl, body).pipe(map((res) => res), catchError(res => this.handleError(res)))
  }

  getService(pUrl): Observable<any> {
    return this.http.get(pUrl)
  }

  postService(pUrl, body): Observable<any> {
    return this.http.post(pUrl, body)
  }

  handleError(error: any) {
    this.ds.hideLoader()
    // let errMsg = (error.message) ? error.message :
    //   error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return of(error);
  }


  getFakeMessages(): Observable<any> {
    return this.http.get("./assets/data.json").pipe(map((res) => {
      return res
    }))
  }


}
