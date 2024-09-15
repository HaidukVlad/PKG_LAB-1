import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ColorConverterComponent } from "./color-converter/color-converter.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ColorConverterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'lab1';
}
