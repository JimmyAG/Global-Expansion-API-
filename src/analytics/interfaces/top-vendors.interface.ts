interface Vendor {
  vendorId: string;
  name: string;
  avgScore: number;
}

export interface TopVendors {
  country: string;
  topVendors: Vendor[];
  researchDocCount: number;
}

export type VendorAggregateRow = {
  country: string;
  vendor_id: string;
  vendor_name: string;
  avg_score: string;
};
