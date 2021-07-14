import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'
import { DashboardComponent } from './dashboard.component';
import { LetModule, PushModule } from '@rx-angular/template';
import { MsToTimeModule, Ms2TimePipe } from '@opis/ms2time';

@NgModule({
  imports: [
    CommonModule,
    LetModule,
    PushModule,
    MsToTimeModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent
      }
    ])
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule {}
