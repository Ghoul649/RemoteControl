import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './modules/app/app.module';

platformBrowser().bootstrapModule(AppModule)
  .catch((err) => console.error(err));
