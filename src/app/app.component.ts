import { Component } from '@angular/core';
import { GithubService } from './github.service';
import { Observable } from 'rxjs';
import { User } from './User';
import { Repository } from './Repository';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    title = 'github-app';

    searchResults$: Observable<[User[], Repository[]]>;

    constructor(private github: GithubService) {
        this.searchResults$ = this.github.searchResults$;
        this.github.searchQuery = 'test';
    }
}
