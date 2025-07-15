export interface Cars {
  brands: Brand[];
  totalBrands: number | null;
}

export interface Brand {
  make: string;
  totalModels: number | null;
  models: Model[];
}

export interface Model {
  model: string;
  basemodel: string;
  year: string;
  img: {
    src: Promise<string>;
  };
}

export type ModelStatus = Model & {
  id: number,
  colors: Promise<[]>,
  color: Promise<string>,
  img: {
    src: Promise<string>,
    loaded: boolean
  }
}
