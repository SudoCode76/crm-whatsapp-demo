import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { InboxService } from '../../../core/services/inbox.service';

@Component({
  selector: 'app-chatbot-monitor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './monitor.html',
  styleUrl: './monitor.css',
})
export class ChatbotMonitor {
  private inbox = inject(InboxService);
  convBot = this.inbox.bot;
  totalBot = computed(() => this.convBot().length);
}
