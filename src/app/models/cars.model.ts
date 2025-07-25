export interface Cars {
  brands: Brand[];
  totalBrands: number | null;
}

export interface Brand {
  make: string;
  totalModels: number | null;
  models: ModelStatus[];
}

export interface Model {
  model: string;
  basemodel: string;
  id: number;
  year: string;
  img: {
    src: Promise<string>;
  };
}

export type ModelStatus = Model & {
  id: number,
  idoffset: number,
  colors: Promise<[]>,
  color: Promise<string>,
  img: {
    src: Promise<string>,
    loaded: boolean
  }
}

export interface ModelsByYear {
  year: string,
  models: ModelStatus[];
}
