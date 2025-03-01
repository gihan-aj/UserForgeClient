import { computed, Injectable, signal } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoadingService{
    private loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();

    // isLoading = signal(false);

    // private toggleLoading = computed(() => {
    //     this.loadingSubject.next(this.isLoading())
    //     console.log(this.isLoading()? 'app is loading' : 'app is loaded');
        
    // })

    start(){
        this.loadingSubject.next(true);
    }

    finish(){
        this.loadingSubject.next(false);
    }
}