import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import RadioStIsr from '../isr.json';
import RadioStUkr from '../ukr.json';
import { AudioComponent } from '../audio/audio-component/audio-component.component';
import { AudioPlayerComponent} from '../audio-player/audio-player.component';

interface StationImage {
  path: string;
  id: number;
}

@Component({
  selector: "app-radio-player",
  templateUrl: "./radio-player.component.html",
  styleUrls: ["./radio-player.component.scss"],
  standalone: true,
  imports: [CommonModule, AudioComponent, AudioPlayerComponent]
})
export class RadioPlayerComponent implements OnInit {
  // Using signals for reactive state management
  radioStations:{id:string, url:string, name: string}[] = RadioStIsr;
  //RadioStUkr;
  src = signal<any>(null); // Default to empty string
  stImages = signal<StationImage[]>([]);
  favoritesVisible: boolean = true; // Default to visible
  private queryParamSubscription: Subscription | undefined;
  routeParam: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.queryParamSubscription = this.route.queryParams.subscribe((params) => {
      this.routeParam = params['country']; 
      if(this.routeParam === 'isr'){
        this.radioStations = RadioStIsr;
      } else if(this.routeParam === 'ukr'){
        this.radioStations = RadioStUkr;
      }
      else{
        this.routeParam = 'isr';
      }
      const savedStations = localStorage.getItem('stations'+this.routeParam);
      if (savedStations) {
        this.stImages.set(JSON.parse(savedStations));
      }
      else{
        this.stImages.set([]);
      }
    });
   
  }
  ngOnDestroy(): void {
    if (this.queryParamSubscription) {
      this.queryParamSubscription.unsubscribe();
    }
  }

  play(id: number): void {
    setTimeout(() => this.src.set(this.getSrcById(id)), 50);
  }

  getSrcById(id: number): any {
    return this.radioStations[id];
  }

  addToFavorities(id: number): void {
    const newStation: StationImage = {
      path: `assets/${this.routeParam}/${this.getSrcById(id).id}${this.routeParam=='isr'?'.jpg':'.png'}`,
      id: id
    };

    this.stImages.update(current => {
      const updated = [...current, newStation];
      localStorage.setItem('stations'+this.routeParam, JSON.stringify(updated));
      return updated;
    });
  }

  clear(): void {
    this.stImages.set([]);
    localStorage.setItem('stations', JSON.stringify([]));
  }

  handleAudioError(event: any): void {
    console.error('Audio error:', event);
    // Implement error handling logic
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/fallback.jpg'; // Replace with your fallback image
  }
}
