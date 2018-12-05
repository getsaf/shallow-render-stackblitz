import { APP_BASE_HREF, Location } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Shallow } from 'shallow-render';

//////////////////////////////////////////////////////////////
// See Angular docs here:
// https://angular.io/api/router/testing/RouterTestingModule
//////////////////////////////////////////////////////////////

////// Module Setup //////
@Component({
  selector: 'go-home-link',
  template: '<a (click)="goHome()">Go somewhere</a>',
})
class GoHomeLinkComponent {
  labelText: string;

  constructor(public router: Router) {}

  async goHome() {
    await this.router.navigate(['home']);
  }
}
const routes: Routes = [
  {path: 'home', component: class DummyComponent {}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [{provide: APP_BASE_HREF, useValue: '/'}],
  declarations: [GoHomeLinkComponent],
})
class GoHomeModule {}
//////////////////////////

describe('component with routing', () => {
  let shallow: Shallow<GoHomeLinkComponent>;

  beforeEach(() => {
    shallow = new Shallow(GoHomeLinkComponent, GoHomeModule)
      //////////////////////////
      // These are good candidates for global setup
      // using `neverMock` and `alwaysProvide`
      .provide({provide: APP_BASE_HREF, useValue: '/'})
      .dontMock(APP_BASE_HREF)
      ///////////////////////////
      .replaceModule(
        RouterModule,
        RouterTestingModule.withRoutes(routes)
      );
  });

  it('uses the route', async () => {
    const {fixture, find, get} = await shallow.render();
    const location = get(Location);
    find('a').triggerEventHandler('click', {});
    await fixture.whenStable();

    expect(location.path()).toBe('/home');
  });
});
