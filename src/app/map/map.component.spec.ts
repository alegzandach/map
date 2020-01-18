import { async, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component'

beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [
            MapComponent
        ],
    }).compileComponents();
}));
it('should create the app', async(() => {
    const fixture = TestBed.createComponent(MapComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
}));