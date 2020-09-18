import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { Repository, RepositoryResponse } from './Repository';
import { map, takeUntil, tap } from 'rxjs/operators';
import { User, UserResponse } from './User';

const API_URL = 'https://api.github.com';

@Injectable({
    providedIn: 'root',
})
export class GithubService implements OnDestroy {

    headers = {'Content-Type': 'application/vnd.github.v3+json'};

    private _users$ = new BehaviorSubject<User[]>([]);
    private _repos$ = new BehaviorSubject<Repository[]>([]);

    set searchQuery(query: string) {
        this._searchQuery$.next(query);
    }

    private _searchQuery$ = new BehaviorSubject('');
    private _searchResults$ = new BehaviorSubject<any>([]);
    public searchResults$;

    private $unsubscribe = new Subject();

    constructor(private http: HttpClient) {

        this.searchResults$ = combineLatest([this._users$, this._repos$]).pipe(tap(console.log));
        this._searchQuery$.subscribe(query => {
            console.log(query);
            this.searchAll(query);
        });
    }

    ngOnDestroy(): void {
        this.$unsubscribe.next();
        this.$unsubscribe.complete();
    }

    private searchAll(query): void {
        if (query) {
            this.searchUsers(query);
            this.searchRepositories(query);
        }

    }

    private searchUsers(query: string = ''): void {
        this.searchGithub<UserResponse>('users', query)
            .pipe(
                map(res => res.items),
                takeUntil(this.$unsubscribe),
            )
            .subscribe(users => this._users$.next(users));
    }

    searchRepositories(query: string = ''): void {
        this.searchGithub<RepositoryResponse>('repositories', query)
            .pipe(
                map(res => res.items),
                takeUntil(this.$unsubscribe),
            )
            .subscribe(repos => this._repos$.next(repos));
    }

    searchGithub<T>(field: string, query: string): Observable<T> {
        return this.http.get<T>(`${API_URL}/search/${field}?q=${query}`,
            {headers: this.headers});
    }
}
