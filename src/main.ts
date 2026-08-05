import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) =>
  // The single sanctioned console call: if bootstrap itself fails, no logger,
  // error handler or UI exists yet — the console is all there is.
  // eslint-disable-next-line no-console
  console.error(err),
);
