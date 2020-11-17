import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component, NgModule, OnInit } from '@angular/core';
import { fakeAsync, flush } from '@angular/core/testing';
import { Shallow } from 'shallow-render';

////// Module Setup //////
@Component({
  selector: 'service-response-label',
  template: '<label>{{labelText}}</label>',
})
class FooLabelComponent implements OnInit {
  labelText?: string;

  constructor(private _httpClient: HttpClient) {}
  async ngOnInit() {
    this.labelText = await this._httpClient
      .get<string>('/foo/as/a/service')
      .toPromise()
      .catch(() => 'ERROR');
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
    shallow = new Shallow(FooLabelComponent, FooLabelModule).replaceModule(HttpClientModule, HttpClientTestingModule);
  });

  it('displays the response from the foo service', fakeAsync(async () => {
    const { element, inject, fixture } = await shallow.render();
    const client = inject(HttpTestingController);
    client.expectOne('/foo/as/a/service').flush('foo response');
    flush();
    fixture.detectChanges();

    expect(element.nativeElement.innerText).toBe('foo response');
  }));

  it('displays ERROR when a service error occurs', fakeAsync(async () => {
    const { element, inject, fixture } = await shallow.render();
    const client = inject(HttpTestingController);
    client.expectOne('/foo/as/a/service').error(new ErrorEvent('BOOM'));
    flush();
    fixture.detectChanges();

    expect(element.nativeElement.innerText).toBe('ERROR');
  }));
});
