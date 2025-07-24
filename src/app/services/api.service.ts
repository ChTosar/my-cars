import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Api {

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
    url.searchParams.append('select', 'model, basemodel, year, id');
    url.searchParams.append('limit', this.carsLimitReq.toString());
    url.searchParams.append('order_by', 'year DESC');

    if (offset) {
      url.searchParams.append('offset', offset.toString());
    }

    return this.http.get(url.toString());
  }

  searchModel(brand: string, text: string): Observable<any> {
    const url = new URL(this.apiUrl);
    url.searchParams.append('select', 'model, basemodel, year, id');
    url.searchParams.append('where',`suggest(model, "${text}")`);
    url.searchParams.append('refine', `make:${brand}`);
    url.searchParams.append('limit', this.carsLimitReq.toString());
    url.searchParams.append('order_by', 'year DESC');

    return this.http.get(url.toString());
  }


  async getCarColors(brand: string, model: string, year: string) {

    const url = new URL(this.colors);

    url.searchParams.delete('make');
    url.searchParams.append('make', brand);
    url.searchParams.append('make', brand);
    url.searchParams.append('modelFamily', model);
    url.searchParams.append('modelRange', model);
    url.searchParams.append('countryCode', 'ES');
    url.searchParams.append('year', year);

    const result = this.http.get<any>(url.toString());

    let paintCombinations: string[] = [];

    await result.toPromise().then(data => {

      if (data!.paintData!.paintCombinations) {
        paintCombinations = data!.paintData!.paintCombinations;
      }

    });

    return paintCombinations;
  }

  async randomColor(combinations: Promise<[]>): Promise<string> {

    const paintCombinations: any = await combinations;

    let results: string[] = [];

    // Get real avaliable colors
    for (const key in paintCombinations) {
      for (const mappedKey in paintCombinations[key].mapped) {
        if (paintCombinations[key].mapped[mappedKey].paintDescription != '') {
          results.push(paintCombinations[key].mapped[mappedKey].paintDescription);
          break;
        }
      }
    }

    const random = Math.floor(Math.random() * results.length);
    const result = results[random];

    return result;
  }

  async getImg(brand: string, model: string, year: string, size: string, color: Promise<string>) {

    const url = new URL(this.imgUrl);

    url.searchParams.append('make', brand);
    url.searchParams.append('modelFamily', model);
    url.searchParams.append('modelRange', model);
    url.searchParams.append('year', year);
    url.searchParams.append('zoomType', 'fullscreen');
    url.searchParams.append('paintDescription', await color);
    url.searchParams.append('width', size);

    return url.toString();

  }

  get360Imgs(brand: string, model: string, year: string, color: string): string[] {

    const imgs: string[] = [];
    const angles = ["200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211", "212", "213", "214", "215", "216", "217", "218", "219", "220", "221", "222", "223", "224", "225", "226", "227", "228", "229", "230", "231"];

    for (const angle of angles) {
      const url = new URL(this.imgUrl);

      url.searchParams.delete('angle');
      url.searchParams.append('angle', angle);
      url.searchParams.append('make', brand);
      url.searchParams.append('modelFamily', model);
      url.searchParams.append('modelRange', model);
      url.searchParams.append('year', year);
      url.searchParams.append('width', '1080');
      url.searchParams.append('paintDescription', color);

      imgs.push(url.toString());
    }

    return imgs;
  }

}

