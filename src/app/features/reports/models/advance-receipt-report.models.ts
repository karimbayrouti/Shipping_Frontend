/** إيصال سلفة سائق — acknowledges a driver's cash advance for a trip's expenses. */
export interface AdvanceReceiptPrintData {
  readonly tripNo: string;
  readonly driverName: string;
  readonly date: string;
  readonly amount: string;
  readonly originCity: string;
  readonly destinationCountry: string;
}
