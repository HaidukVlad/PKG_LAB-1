import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, FormGroup, FormControl, Validators, ReactiveFormsModule } from "@angular/forms";
import { ColorPickerModule } from 'ngx-color-picker';

@Component({
  selector: 'app-color-converter',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ColorPickerModule],
  templateUrl: './color-converter.component.html',
  styleUrls: ['./color-converter.component.css']
})
export class ColorConverterComponent implements OnChanges {

  public color: string = "#000000";

  public r: number = 0;
  public g: number = 0;
  public b: number = 0;

  public h: number = 0;
  public s: number = 0;
  public v: number = 0;

  public c: number = 0;
  public m: number = 0;
  public y: number = 0;
  public k: number = 100;

  cmykForm = new FormGroup({
    "C": new FormControl(this.c, [Validators.min(0), Validators.max(100), Validators.maxLength(3)]),
    "M": new FormControl(this.m, [Validators.min(0), Validators.max(100), Validators.maxLength(3)]),
    "Y": new FormControl(this.y, [Validators.min(0), Validators.max(100), Validators.maxLength(3)]),
    "K": new FormControl(this.k, [Validators.min(0), Validators.max(100), Validators.maxLength(3)]),
  });

  rgbForm = new FormGroup({
    "R": new FormControl(this.r, [Validators.min(0), Validators.max(255), Validators.maxLength(3)]),
    "G": new FormControl(this.g, [Validators.min(0), Validators.max(255), Validators.maxLength(3)]),
    "B": new FormControl(this.b, [Validators.min(0), Validators.max(255), Validators.maxLength(3)]),
  });

  hsvForm = new FormGroup({
    "H": new FormControl(this.h, [Validators.min(0), Validators.max(360), Validators.maxLength(3)]),
    "S": new FormControl(this.s, [Validators.min(0), Validators.max(100), Validators.maxLength(3)]),
    "V": new FormControl(this.v, [Validators.min(0), Validators.max(100), Validators.maxLength(3)]),
  });


  ngOnChanges(changes: SimpleChanges) {
    if (changes['cmykForm']) {
      this.updateCmykValues();
    }
  }

  rgbToCmyk(r: number, g: number, b: number): number[] {
    const c = 1 - r / 255;
    const m = 1 - g / 255;
    const y = 1 - b / 255;
    const k = Math.min(c, Math.min(m, y));

    return [
      Math.round((c - k) / (1 - k) * 100),
      Math.round((m - k) / (1 - k) * 100),
      Math.round((y - k) / (1 - k) * 100),
      Math.round(k * 100)
    ];
  }

  cmykToRgb(c: number, m: number, y: number, k: number): number[] {
    const r = 255 * (1 - c / 100) * (1 - k / 100);
    const g = 255 * (1 - m / 100) * (1 - k / 100);
    const b = 255 * (1 - y / 100) * (1 - k / 100);

    return [Math.round(r), Math.round(g), Math.round(b)];
  }

  rgbToHsv(r: number, g: number, b: number): number[] {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    const s = max === 0 ? 0 : d / max;
    let h = 0;

    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(max * 100)];
  }

  hsvToRgb(h: number, s: number, v: number): number[] {
    const f = (n: number, k = (n + h * 6) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);

    return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)];
  }

  updateCmykValues() {
    const cValue = this.cmykForm.get('C')?.value;
    const mValue = this.cmykForm.get('M')?.value;
    const yValue = this.cmykForm.get('Y')?.value;
    const kValue = this.cmykForm.get('K')?.value;

    if (cValue !== null && cValue !== undefined) this.c = Math.max(0, Math.min(100, cValue));
    if (mValue !== null && mValue !== undefined) this.m = Math.max(0, Math.min(100, mValue));
    if (yValue !== null && yValue !== undefined) this.y = Math.max(0, Math.min(100, yValue));
    if (kValue !== null && kValue !== undefined) this.k = Math.max(0, Math.min(100, kValue));

    this.cmykForm.patchValue({
      C: this.c,
      M: this.m,
      Y: this.y,
      K: this.k
    });

    [this.r, this.g, this.b] = this.cmykToRgb(this.c, this.m, this.y, this.k);

    this.rgbForm.patchValue({
      R: this.r,
      G: this.g,
      B: this.b
    });

    this.color = "#" + ((1 << 24) + (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b)).toString(16).slice(1);

    [this.h, this.s, this.v] = this.rgbToHsv(this.r, this.g, this.b);

    this.hsvForm.patchValue({
      H: this.h,
      S: this.s,
      V: this.v
    });
  }

  onRgbChange() {
    const rValue = this.rgbForm.get('R')?.value;
    const gValue = this.rgbForm.get('G')?.value;
    const bValue = this.rgbForm.get('B')?.value;

    if (rValue !== null && rValue !== undefined &&
        gValue !== null && gValue !== undefined &&
        bValue !== null && bValue !== undefined) {
      this.r = Math.max(0, Math.min(255, rValue));
      this.g = Math.max(0, Math.min(255, gValue));
      this.b = Math.max(0, Math.min(255, bValue));

      this.rgbForm.patchValue({
        R: this.r,
        G: this.g,
        B: this.b
      });

      [this.c, this.m, this.y, this.k] = this.rgbToCmyk(this.r, this.g, this.b);

      this.cmykForm.patchValue({
        C: this.c,
        M: this.m,
        Y: this.y,
        K: this.k
      });

      this.color = "#" + ((1 << 24) + (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b)).toString(16).slice(1);

      [this.h, this.s, this.v] = this.rgbToHsv(this.r, this.g, this.b);

      this.hsvForm.patchValue({
        H: this.h,
        S: this.s,
        V: this.v
      });
    }
  }

  onHsvChange() {
    const hValue = this.hsvForm.get('H')?.value;
    const sValue = this.hsvForm.get('S')?.value;
    const vValue = this.hsvForm.get('V')?.value;

    if (hValue !== null && hValue !== undefined &&
        sValue !== null && sValue !== undefined &&
        vValue !== null && vValue !== undefined) {
      this.h = Math.max(0, Math.min(360, hValue));
      this.s = Math.max(0, Math.min(100, sValue));
      this.v = Math.max(0, Math.min(100, vValue));

      this.hsvForm.patchValue({
        H: this.h,
        S: this.s,
        V: this.v
      });

      [this.r, this.g, this.b] = this.hsvToRgb(this.h / 360, this.s / 100, this.v / 100);

      this.rgbForm.patchValue({
        R: this.r,
        G: this.g,
        B: this.b
      });

      this.color = "#" + ((1 << 24) + (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b)).toString(16).slice(1);

      this.onRgbChange();
    }
  }

  updateHex() {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.color);
    if (!result) {
      throw new Error('Invalid HEX value');
    }

    this.r = parseInt(result[1], 16);
    this.g = parseInt(result[2], 16);
    this.b = parseInt(result[3], 16);

    this.rgbForm.patchValue({
      R: this.r,
      G: this.g,
      B: this.b
    });

    this.onRgbChange();
  }

}