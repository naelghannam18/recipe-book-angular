import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    
    loadedFeature: string = 'recipe';
    
    ngOnInit(): void {
        
    }
    title = 'angular-tutorial';

    onNavigate(feature: string) 
    {
      this.loadedFeature = feature;
    }
}
