import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageService } from '../services/data-storage/data-storage.service';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { User } from '../services/authentication/user.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
    isCollapsed: boolean = false;
    isAuthenticated = false;
    userSub!: Subscription;
    constructor(
        private dataStorageService: DataStorageService,
        private authService: AuthenticationService
    ) {}

    ngOnInit(): void {
        this.userSub = this.authService.user.subscribe((user: User | null) => {
            this.isAuthenticated = !!user;
        });
    }

    onSaveData() {
        this.dataStorageService.storeRecipes();
    }

    onFetchData() {
        this.dataStorageService.fetchRecipes().subscribe();
    }

    onLogout() {
        this.authService.logout();
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
}
