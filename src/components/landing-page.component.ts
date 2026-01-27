import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 font-sans text-slate-800 pb-20">
      
      <!-- Teal Header -->
      <div class="bg-[#139C84] pt-20 pb-24 text-center px-4 shadow-sm">
         <h1 class="text-5xl font-bold text-white tracking-tight mb-2">StackConnect</h1>
         <p class="text-teal-100 text-lg font-medium">Multi-Event Management Platform</p>
      </div>

      <!-- Main Action Floating Button -->
      <div class="flex justify-center -mt-7 mb-12 relative z-10">
        <button (click)="openModal()" class="bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold py-3.5 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 text-lg">
           <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
           Create New Event
        </button>
      </div>

      <!-- Active Events Section -->
      <div class="max-w-6xl mx-auto px-6">
        <div class="flex items-center gap-2 mb-6 text-[#139C84] font-bold text-xl">
           <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
           Active Events
        </div>

        @if (dataService.savedEvents().length === 0) {
           <div class="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
             <p>No active events found.</p>
             <p class="text-sm mt-1">Click the button above to create your first event.</p>
           </div>
        }

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           @for (event of dataService.savedEvents(); track event.id) {
              <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative group">
                 
                 <!-- Delete Button -->
                 <button (click)="deleteEvent(event.id); $event.stopPropagation()" class="absolute top-4 right-4 text-gray-300 hover:text-red-400 transition-colors p-1" title="Delete Event">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                 </button>

                 <div class="pr-8 cursor-pointer" (click)="openEvent(event.id)">
                   <h3 class="text-xl font-bold text-gray-800 mb-1 leading-tight">{{ event.name }}</h3>
                   <p class="text-sm text-gray-500 mb-6">Created {{ event.createdAt | date:'mediumDate' }}</p>
                 </div>
                 
                 <div class="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Share Links</p>
                    
                    <!-- Admin Link -->
                    <div class="flex items-center justify-between group/link">
                       <div class="flex items-center gap-2">
                          <span class="w-2 h-2 rounded-full bg-teal-400"></span>
                          <span class="text-gray-600 font-medium text-sm">Admin Desk</span>
                       </div>
                       <button (click)="copyLink('desk', event.id)" class="text-xs text-teal-600 font-medium border border-teal-200 bg-white px-3 py-1 rounded hover:bg-teal-50 transition-colors">
                          {{ copiedId() === event.id + '_desk' ? 'Copied!' : 'Copy Link' }}
                       </button>
                    </div>

                    <!-- SPOC Link -->
                    <div class="flex items-center justify-between group/link">
                       <div class="flex items-center gap-2">
                          <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                          <span class="text-gray-600 font-medium text-sm">Sales SPOC</span>
                       </div>
                       <button (click)="copyLink('spoc', event.id)" class="text-xs text-blue-600 font-medium border border-blue-200 bg-white px-3 py-1 rounded hover:bg-blue-50 transition-colors">
                          {{ copiedId() === event.id + '_spoc' ? 'Copied!' : 'Copy Link' }}
                       </button>
                    </div>

                    <!-- Walk-in Link -->
                    <div class="flex items-center justify-between group/link">
                       <div class="flex items-center gap-2">
                          <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                          <span class="text-gray-600 font-medium text-sm">Walk-in</span>
                       </div>
                       <button (click)="copyLink('walkin', event.id)" class="text-xs text-amber-600 font-medium border border-amber-200 bg-white px-3 py-1 rounded hover:bg-amber-50 transition-colors">
                          {{ copiedId() === event.id + '_walkin' ? 'Copied!' : 'Copy Link' }}
                       </button>
                    </div>
                 </div>

                 <div class="flex justify-end pt-2 border-t border-gray-100">
                    <button (click)="openEvent(event.id)" class="text-[#139C84] font-semibold hover:text-[#0d7d69] flex items-center gap-1 text-sm transition-colors">
                       Open Dashboard <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                 </div>
              </div>
           }
        </div>
      </div>

      <!-- Create Modal -->
      @if (isModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
           <!-- Backdrop -->
           <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" (click)="closeModal()"></div>
           
           <!-- Modal Panel -->
           <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-fade-in-up">
              <div class="p-8">
                 <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                       <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-800">Create New Event</h2>
                 </div>

                 <div class="space-y-6">
                    <!-- URL Input -->
                    <div>
                       <label class="block text-sm font-semibold text-gray-700 mb-1.5">Google Sheet URL</label>
                       <div class="flex gap-2">
                          <input 
                             type="text" 
                             [ngModel]="newSheetUrl()" 
                             (ngModelChange)="newSheetUrl.set($event)"
                             placeholder="https://docs.google.com/spreadsheets/..." 
                             class="flex-1 rounded-lg border-gray-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow">
                          <button 
                             (click)="fetchSheets()" 
                             [disabled]="isFetching() || !newSheetUrl()"
                             class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 whitespace-nowrap shadow-sm">
                             {{ isFetching() ? 'Fetching...' : 'Fetch Sheets' }}
                          </button>
                       </div>
                       <p class="text-xs text-gray-400 mt-1.5">Paste the full URL of your Google Sheet then click Fetch.</p>
                    </div>

                    <!-- Event Name / Worksheet Select -->
                    <div>
                       <label class="block text-sm font-semibold text-gray-700 mb-1.5">Event Name (Worksheet Name)</label>
                       @if (fetchedSheets().length > 0) {
                          <select 
                             [ngModel]="newEventName()" 
                             (ngModelChange)="newEventName.set($event)"
                             class="w-full rounded-lg border-gray-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white cursor-pointer transition-shadow appearance-none">
                             <option value="" disabled>Select a worksheet</option>
                             @for (sheet of fetchedSheets(); track sheet) {
                                <option [value]="sheet">{{ sheet }}</option>
                             }
                          </select>
                          <p class="text-xs text-gray-400 mt-1.5">Select the specific tab to sync with.</p>
                       } @else {
                          <input 
                             type="text" 
                             [ngModel]="newEventName()" 
                             (ngModelChange)="newEventName.set($event)"
                             placeholder="e.g. Q3 Summit" 
                             class="w-full rounded-lg border-gray-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow">
                          <p class="text-xs text-gray-400 mt-1.5">Or enter manually if fetch fails.</p>
                       }
                    </div>
                 </div>
              </div>

              <div class="bg-gray-50 px-8 py-4 flex justify-end gap-3 border-t border-gray-100">
                 <button (click)="closeModal()" class="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all">Cancel</button>
                 <button 
                    (click)="createEvent()" 
                    [disabled]="!newEventName() || !newSheetUrl()"
                    class="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#139C84] hover:bg-[#0d7d69] shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
                    Create Event
                 </button>
              </div>
           </div>
        </div>
      }
    </div>
  `
})
export class LandingPageComponent implements OnInit {
  dataService = inject(DataService);
  router = inject(Router);

  isModalOpen = signal(false);
  
  // Form Signals
  newSheetUrl = signal('');
  newEventName = signal('');
  
  // Fetching State
  isFetching = signal(false);
  fetchedSheets = signal<string[]>([]);
  
  // UI Feedback
  copiedId = signal<string | null>(null);

  ngOnInit() {
     // Fetch all active events from master log on load
     this.dataService.fetchAllEventsFromMasterLog();
  }

  openModal() {
    this.newSheetUrl.set('');
    this.newEventName.set('');
    this.fetchedSheets.set([]);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  async fetchSheets() {
    if (!this.newSheetUrl()) return;
    this.isFetching.set(true);
    const sheets = await this.dataService.fetchSheetMetadata(this.newSheetUrl());
    this.fetchedSheets.set(sheets);
    if (sheets.length > 0) {
      this.newEventName.set(sheets[0]);
    }
    this.isFetching.set(false);
  }

  async createEvent() {
    if (!this.newEventName() || !this.newSheetUrl()) return;
    
    const event = this.dataService.addEvent(this.newEventName(), this.newSheetUrl());
    
    // Log creation to backend
    this.dataService.logEventToBackend({
      eventId: event.id,
      eventName: event.name,
      sheetUrl: event.sheetUrl,
      deskLink: this.generateLink('desk', event.id),
      spocLink: this.generateLink('spoc', event.id),
      walkinLink: this.generateLink('walkin', event.id),
      createdAt: new Date().toISOString()
    });

    this.closeModal();
  }

  deleteEvent(id: string) {
    if (confirm('Are you sure you want to delete this event from your local list?')) {
      this.dataService.removeEvent(id);
    }
  }

  openEvent(id: string) {
    sessionStorage.setItem('from_landing', 'true');
    this.router.navigate(['/event', id]);
  }

  generateLink(type: 'desk'|'spoc'|'walkin', eventId: string): string {
     // Robustly handle hash routing construction
     const baseUrl = window.location.href.split('#')[0];
     let route = '';
     switch(type) {
        case 'desk': route = `#/event/${eventId}/desk`; break;
        case 'spoc': route = `#/event/${eventId}/spoc`; break;
        case 'walkin': route = `#/register/${eventId}`; break;
     }
     return `${baseUrl}${route}`;
  }

  copyLink(type: 'desk'|'spoc'|'walkin', eventId: string) {
     const fullUrl = this.generateLink(type, eventId);
     
     navigator.clipboard.writeText(fullUrl).then(() => {
        const key = eventId + '_' + type;
        this.copiedId.set(key);
        setTimeout(() => {
           if (this.copiedId() === key) {
              this.copiedId.set(null);
           }
        }, 2000);
     });
  }
}