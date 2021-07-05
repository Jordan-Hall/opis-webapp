import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PushModule } from '@rx-angular/template'
import { LayoutComponent } from './layout.component';

@NgModule({
  imports: [CommonModule, RouterModule, PushModule],
  declarations: [LayoutComponent],
  exports: [LayoutComponent]
})
export class LayoutModule {}
