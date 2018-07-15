import './global-jasmine';
import 'jasmine-core/lib/jasmine-core/jasmine-html.js';
import 'jasmine-core/lib/jasmine-core/boot.js';

declare var jasmine;

// Polyfills
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Spec files to include in the Stackblitz tests
import './examples';

function bootstrap () {
  if (window['jasmineRef']) {
    location.reload();
    return;
  } else {
    window.onload(undefined);
    window['jasmineRef'] = jasmine.getEnv();
  }

  // First, initialize the Angular testing environment.
  getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
  );
}

bootstrap();

// If you use Shallow's `always` or `never` functions, this is the spot.
// Shallow
//   .alwaysProvide(MyThing)
//   .alwaysMock(MyThing, {fooMethod: () => 'FOO!'})
//   .alwaysReplaceModule(MyModule, MyReplacementModule);
