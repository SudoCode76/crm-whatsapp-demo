import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { InboxService } from '../../../core/services/inbox.service';
import { ConversationStatus } from '../../../core/models/conversation.model';

@Component({
  selector: 'app-bandeja',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './bandeja.html',
  styleUrl: './bandeja.css',
})
export class Bandeja {
  private inbox = inject(InboxService);

  filtro = signal<ConversationStatus | 'todas'>('todas');

  conversaciones = this.inbox.conversations;
  activas = this.inbox.activas;
  enEspera = this.inbox.enEspera;
  cerradas = this.inbox.cerradas;
  bot = this.inbox.bot;

  setFiltro(f: ConversationStatus | 'todas') {
    this.filtro.set(f);
  }

  get lista() {
    if (this.filtro() === 'todas') return this.conversaciones();
    return this.conversaciones().filter((c) => c.status === this.filtro());
  }
}
