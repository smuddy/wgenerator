import {AfterViewInit, Component} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.less']
})
export class LogoutComponent implements AfterViewInit {
  constructor(public afAuth: AngularFireAuth, private router: Router) {
  }

  public async ngAfterViewInit() {
    await this.afAuth.auth.signOut();
    await this.router.navigateByUrl('/');
  }
}
