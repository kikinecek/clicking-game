export class Customer {
  id: string;
  email: string;
  // TODO maybe 2 separate customers (with and without password)
  hashedPassword: string;
  createdAt: Date;
  updatedAt?: Date;
}
