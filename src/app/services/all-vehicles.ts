import { Injectable, model } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AllVehicles {

  private apiUrl = `${environment.apiUrl}/catalog/datasets/all-vehicles-model/records`;
  private imgUrl = `${environment.imgUrl}/getImage?angle=27&billingTag=web&customer=${atob(environment.customer)}`;
  private colors = `${environment.imgUrl}/getPaints?customer=${atob(environment.customer)}&target=car`;
  private brandsLimitReq = 50;
  private carsLimitReq = 15;

  constructor(private http: HttpClient) { }

  getBrands(offset?: Number): Observable<any> {

    const url = new URL(this.apiUrl);
    url.searchParams.append('group_by', 'make');
    url.searchParams.append('limit', this.brandsLimitReq.toString());

    if (offset) {
      url.searchParams.append('offset', offset.toString());
    }

    return this.http.get<any>(url.toString());
  }

  getModels(brand: string, offset?: Number): Observable<any> {

    const url = new URL(this.apiUrl);
    url.searchParams.append('refine', `make:${brand}`);
    url.searchParams.append('select', 'model, basemodel, year');
    url.searchParams.append('limit', this.carsLimitReq.toString());
    url.searchParams.append('order_by', 'year DESC');

    if (offset) {
      url.searchParams.append('offset', offset.toString());
    }

    return this.http.get<any>(url.toString());
  }


  async getCarColors(brand: string, model: string, year: string) {

    const url = new URL(this.colors);

    url.searchParams.append('make', brand);
    url.searchParams.append('make', brand);
    url.searchParams.append('modelFamily', model);
    url.searchParams.append('modelRange', model);
    url.searchParams.append('countryCode', 'ES');
    url.searchParams.append('year', year);

    const result = this.http.get<any>(url.toString());

    let color: string = '';

    await result.toPromise().then(data => {

      if (data!.paintData!.paintCombinations) {

        const paintCombinations = data!.paintData!.paintCombinations;
        color = this.filterAvailableColors(paintCombinations);
      }

    });

    return color;
  }

  private filterAvailableColors(paintCombinations: any[]): string {

    let result: string = '';

    for (const key in paintCombinations) {

      for (const mappedKey in paintCombinations[key].mapped) {
        if (paintCombinations[key].mapped[mappedKey].paintDescription != '') {
          result = paintCombinations[key].mapped[mappedKey].paintDescription;
          break;
        }
      }
    }

    return result;
  }

  async getImg(brand: string, model: string, year: string, size: string): Promise<string> {

    const color = await this.getCarColors(brand, model, year);

    const url = new URL(this.imgUrl);

    url.searchParams.append('make', brand);
    url.searchParams.append('modelFamily', model);
    url.searchParams.append('modelRange', model);
    url.searchParams.append('year', year);
    url.searchParams.append('zoomType', 'fullscreen');
    url.searchParams.append('paintDescription', color as string);
    url.searchParams.append('width', size);

    return url.toString();

  }
}

