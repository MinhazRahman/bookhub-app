export class Book {
  // constructor with parameter properties
  constructor(
    public stockKeepingUnit: string,
    public name: string,
    public author: string,
    public description: string,
    public unitPrice: number,
    public imageUrl: string,
    public active: boolean,
    public unitsInStock: number,
    public dateCreated: Date,
    public lastUpdated: Date
  ) {}
}
