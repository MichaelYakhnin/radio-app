import {
  Component,
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
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface AudioState {
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'error';
  error?: string;
}

@Component({
  selector: 'audio-player',
  templateUrl: './audio-component.component.html',
  styleUrls: ['./audio-component.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AudioComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) src!: string;
  type?: string;
  @Input() autoplay = false;
  @Input() showStateLabel = false;
  @Input() volume = 1.0;

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

  setVolume(value: string): void {
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
    this.getAudioTypeCanPlayType();
    this.audio = this._audioRef.nativeElement;

    if (this.audio) {
      this.audio.volume = this.clampVolume(this.volume.toString());
      this.audio.autoplay = this.autoplay;

      this.setupEventListeners();
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  getAudioTypeCanPlayType(): void {
    const audioElement = this._audioRef.nativeElement;
    if (!audioElement.src) {
      this.type = 'Unknown (no source)';
      return;
    }

    const mimeTypesToTest = [
      'audio/mpeg',       // MP3
      'audio/ogg',        // Ogg Vorbis
      'audio/wav',        // WAV
      'audio/aac',        // AAC
      'audio/mp4',        // AAC in MP4 container (often used)
      'application/vnd.apple.mpegurl' // HLS (m3u8) - Native browser support is limited
    ];

    for (const mimeType of mimeTypesToTest) {
      if (audioElement.canPlayType(mimeType)) {
        if (mimeType === 'audio/mpeg') {
          this.type = mimeType;
        } else if (mimeType === 'audio/ogg') {
          this.type = mimeType;
        } else if (mimeType === 'audio/wav') {
          this.type = mimeType;
        } else if (mimeType === 'audio/aac' || mimeType === 'audio/mp4') {
          this.type = mimeType;
        } else if (mimeType === 'application/vnd.apple.mpegurl') {
          this.type = mimeType;
        }
        return; // Found a playable type, exit loop
      }
    }

    this.type = 'Unknown (canPlayType inconclusive)';
  }
}
