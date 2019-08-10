import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../../services/auth.service';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
    public user = new FormControl();
    public pass = new FormControl();
    public loginError = false;

    private redirect: string = null;

    constructor(
        private authService: AuthService,
        private router: Router,
        activatedRoute: ActivatedRoute
    ) {
        activatedRoute.queryParams.subscribe(_ => this.redirect = _.redirect);
    }

    ngOnInit() {
        this.loginError = false;
    }

    public onLogin(): void {
        this.authService.login$(this.user.value, this.pass.value).subscribe(_ => {
            if (_ === null) {
                this.loginError = true;
            } else {
                if (this.redirect) {
                    this.router.navigateByUrl('/' + this.redirect);
                }
            }
        });
    }
}
