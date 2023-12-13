export interface DBProduct {
  id: number;
  itemCode: string;
  item: string;
  serviceType: string;
  itemDescription: string;
  price: string;
  uraGoodsCategoryId: string;
  categoryName: string;
  uraGoodsCategoryName: string;
  categoryId: string;
  exciseTaxRate: string;
  vatRate: string;
  ext1: string;
  ext2: string | null;
  profileId: null;
  createdDate: string;
  updatedDate: string;
  empty: boolean;
}

export interface Item {
  id: string;
  item: string;
  itemCode: string;
  qty: string;
  unitOfMeasure: string;
  unitPrice: string;
  total: string;
  taxRate: string;
  tax: string;
  discountTotal: string;
  discountTaxRate: string;
  orderNumber: string;
  discountFlag: string;
  deemedFlag: string;
  exciseFlag: string;
  categoryId: string;
  categoryName: string;
  goodsCategoryId: string;
  goodsCategoryName: string;
  exciseCurrency: string;
  exciseRate: string;
  exciseRateName: string;
  exciseRule: string;
  exciseTax: string;
  exciseUnit: string;
  pack: string;
  stick: string;
  description: string;
}
