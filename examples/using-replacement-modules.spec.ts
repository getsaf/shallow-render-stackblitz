import { Type, Component, NgModule } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Shallow } from 'shallow-render';

////// Module Setup //////
@Component({
  selector: 'service-response-label',
  template: '<label>{{labelText}}</label>',
})
class FooLabelComponent {
  labelText: string;

  constructor(httpClient: HttpClient) {
    httpClient.get<string>('/foo/as/a/service').toPromise()
      .then(
        response => this.labelText = response,
        () => this.labelText = 'ERROR'
      );
  }
}

@NgModule({
  imports: [HttpClientModule],
  declarations: [FooLabelComponent],
})
class FooLabelModule {}
//////////////////////////

describe('using replaceModule', () => {
  let shallow: Shallow<FooLabelComponent>;

  beforeEach(() => {
    shallow = new Shallow(FooLabelComponent, FooLabelModule)
      .replaceModule(HttpClientModule, HttpClientTestingModule);
  });

  it('displays the response from the foo service', fakeAsync(async () => {
    const {element, get, fixture} = await shallow.render();
    const client = get(HttpTestingController as Type<HttpTestingController>);
    client.expectOne('/foo/as/a/service').flush('foo response');
    tick();
    fixture.detectChanges();

    expect(element.nativeElement.innerText).toBe('foo response');
  }));

  it('displays ERROR when a service error occurs', fakeAsync(async () => {
    const {element, get, fixture} = await shallow.render();
    const client = get(HttpTestingController as Type<HttpTestingController>);
    client.expectOne('/foo/as/a/service').error(new ErrorEvent('BOOM'));
    tick();
    fixture.detectChanges();

    expect(element.nativeElement.innerText).toBe('ERROR');
  }));
});
