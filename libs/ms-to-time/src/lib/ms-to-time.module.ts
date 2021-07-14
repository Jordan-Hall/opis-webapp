import { NgModule } from '@angular/core';
import { Ms2TimePipe } from './ms-to-time.pipe';

@NgModule({
  declarations: [Ms2TimePipe],
  exports: [Ms2TimePipe]
})
export class MsToTimeModule {}
