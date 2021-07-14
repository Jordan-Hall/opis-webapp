import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountSidebarComponent } from './sidebar.component';
import { ContainerComponent } from './container-component';
import { DetailsComponent } from './sections/details/details.component';
import { TeamComponent } from './sections/team/team.component';
import { LetModule, PushModule } from '@rx-angular/template';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LetModule,
    PushModule,
    RouterModule.forChild([
      {
        path: '',
        component: ContainerComponent,
        children: [
          {
            path: '',
            pathMatch: '',
            redirectTo: 'your-details',
          },
          {
            path: 'your-details',
            component: DetailsComponent
          },
          {
            path: 'team',
            component: TeamComponent
          }
        ]
      },
    ])
  ],
  declarations: [AccountSidebarComponent, ContainerComponent, DetailsComponent, TeamComponent]
})
export class AccountModule {}
