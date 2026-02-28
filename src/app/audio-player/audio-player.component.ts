import {  Component, 
  Input, 
  AfterViewInit, 
  ViewChild, 
  ElementRef, 
  signal, 
  computed,
  Output,
  EventEmitter,
  OnDestroy,
  effect,
  DestroyRef,
  inject } from '@angular/core';
import Hls from 'hls.js';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, fromEvent } from 'rxjs';

interface AudioState {
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'error';
  error?: string;
}

@Component({
  selector: 'app-audio-player',
  standalone: true, // Marked as standalone
  imports: [],      // No direct Angular Module dependencies to import in this case
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements AfterViewInit, OnDestroy {
  @Input() streamUrl: string | null = null;
  @Input() type?: string;
  @Input() autoplay = false;
  @Input() showStateLabel = false;
  @Input() volume = 1.0;
  private hls: Hls | null = null;
  isPlaying: boolean = false;
  @Output() stateChange = new EventEmitter<AudioState>();
  @Output() error = new EventEmitter<string>();
  @Output() timeUpdate = new EventEmitter<number>();

  private readonly destroyRef = inject(DestroyRef);
  readonly audioState = signal<AudioState>({ status: 'idle' });
  private readonly currentTime = signal(0);
  private readonly duration = signal(0);

  readonly audioStateLabel = computed(() => {
    const state = this.audioState();
    switch (state.status) {
      case 'playing':
        return 'Playing...';
      case 'paused':
        return 'Paused';
      case 'loading':
        return 'Loading...';
      case 'error':
        return `Error: ${state.error || 'Unknown error'}`;
      default:
        return 'Audio sample';
    }
  });

  readonly progress = computed(() => {
    if (!this.duration()) return 0;
    return (this.currentTime() / this.duration()) * 100;
  });

  readonly timeDisplay = computed(() => {
    return this.formatTime(this.currentTime());
  });

  readonly durationDisplay = computed(() => {
    return this.formatTime(this.duration());
  });

  @ViewChild('audioElement') private _audioRef!: ElementRef<HTMLAudioElement>;
  private audio?: HTMLAudioElement;
  private readonly destroy$ = new Subject<void>();

  constructor() { 
    // Monitor state changes
    effect(() => {
      const state = this.audioState();
      this.stateChange.emit(state);
    });
  }

  ngOnDestroy(): void {
    if (this.hls) {
      this.hls.destroy();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
 pause(): void {
     if (this.audio) {
       this.audio.pause();
       this.audioState.set({ status: 'paused' });
     }
   }
 
   get paused(): boolean {
     return !this.audio || this.audio.paused;
   }
 
   async play(): Promise<void> {
     if (!this.audio) return;
 
     try {
       this.audioState.set({ status: 'loading' });
       await this.audio.play();
       this.audioState.set({ status: 'playing' });
     } catch (err) {
       const errorMessage = err instanceof Error ? err.message : 'Unknown error';
       this.audioState.set({ status: 'error', error: errorMessage });
       this.error.emit(errorMessage);
     }
   }
 
   setVolume(value: string ): void {
     if (this.audio) {
       this.audio.volume = this.clampVolume(value);
     }
   }
 
   seek(time: number): void {
     if (this.audio) {
       this.audio.currentTime = Math.max(0, Math.min(time, this.audio.duration));
     }
   }
   getTarget(target: EventTarget | null): HTMLInputElement {
     return target as HTMLInputElement;
   }
 
   seekByPercentage(percentage: number): void {
     if (this.audio) {
       const time = (percentage / 100) * this.audio.duration;
       this.seek(time);
     }
   }
 
   ngAfterViewInit(): void {
     this.audio = this._audioRef.nativeElement;
     
     if (this.audio) {
       this.audio.volume = this.clampVolume(this.volume.toString());
       this.audio.autoplay = this.autoplay;
 
       this.setupEventListeners();
     }
     if (this.streamUrl && this._audioRef) {
      this.setupPlayer(this.streamUrl, this._audioRef.nativeElement);
    }
   }
 
   private setupEventListeners(): void {
     if (!this.audio) return;
 
     fromEvent(this.audio, 'playing').pipe(
       takeUntilDestroyed(this.destroyRef)
     ).subscribe(() => {
       this.audioState.set({ status: 'playing' });
     });
 
     fromEvent(this.audio, 'pause').pipe(
       takeUntilDestroyed(this.destroyRef)
     ).subscribe(() => {
       this.audioState.set({ status: 'paused' });
     });
 
     fromEvent(this.audio, 'ended').pipe(
       takeUntilDestroyed(this.destroyRef)
     ).subscribe(() => {
       this.audioState.set({ status: 'idle' });
     });
 
     fromEvent(this.audio, 'timeupdate').pipe(
       takeUntilDestroyed(this.destroyRef)
     ).subscribe(() => {
       if (this.audio) {
         this.currentTime.set(this.audio.currentTime);
         this.timeUpdate.emit(this.audio.currentTime);
       }
     });
 
     fromEvent(this.audio, 'loadedmetadata').pipe(
       takeUntilDestroyed(this.destroyRef)
     ).subscribe(() => {
       if (this.audio) {
         this.duration.set(this.audio.duration);
       }
     });
 
     fromEvent(this.audio, 'error').pipe(
       takeUntilDestroyed(this.destroyRef)
     ).subscribe((event: Event) => {
       const error = (event.target as HTMLAudioElement).error;
       const errorMessage = error ? error.message : 'Unknown error';
       this.audioState.set({ status: 'error', error: errorMessage });
       this.error.emit(errorMessage);
     });
   }
 
   private clampVolume(volume: string): number {
     return Math.max(0, Math.min(1, Number(volume)));
   }
 
   private formatTime(seconds: number): string {
     const minutes = Math.floor(seconds / 60);
     const remainingSeconds = Math.floor(seconds % 60);
     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
   }
 
  private setupPlayer(streamUrl: string, audioElement: HTMLAudioElement): void {
    if (Hls.isSupported()) {
      this.hls = new Hls();

      this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log('Audio Element attached');
      });

      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('Manifest parsed, audio can play');
        // No need to call play here, let user control play/pause
      });

      this.hls.on(Hls.Events.ERROR, (event, data) => {
        const errorType = data.type;
        const errorDetails = data.details;
        const errorFatal = data.fatal;

        console.error(`HLS error: ${errorType} - ${errorDetails}, Fatal: ${errorFatal}`);
        if (errorFatal) {
          switch (errorDetails) {
            case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
              console.error('Manifest load error, reattempting load');
              this.recoverAndRetry();
              break;
            case Hls.ErrorDetails.MANIFEST_PARSING_ERROR:
              console.error('Manifest parse error, trying to recover');
              this.recoverAndRetry();
              break;
            case Hls.ErrorDetails.LEVEL_LOAD_ERROR:
              console.error('Level load error, cannot recover');
              this.hls?.destroy();
              // Optionally display error to user
              break;
            case Hls.ErrorDetails.UNKNOWN:
              console.error('Media error, attempting recovery');
              this.recoverAndRetry();
              break;
            default:
              console.error('Unrecoverable error');
              this.hls?.destroy();
              // Optionally display error to user
              break;
          }
        }
      });

      this.hls.loadSource(streamUrl);
      this.hls.attachMedia(audioElement);

    } else if (audioElement.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS is very rare, but just in case.
      audioElement.src = streamUrl;
      console.warn('Browser natively supports HLS (uncommon). Using native playback.');
    } else {
      console.error('HLS is not supported by the browser.');
      // Optionally display an error message to the user.
    }
  }

  private recoverAndRetry(): void {
    if (this.hls) {
      this.hls.recoverMediaError();
    }
  }
}