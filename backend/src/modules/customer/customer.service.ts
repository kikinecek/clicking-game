import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Customer } from './models/customer.model';
import { CreateCustomerDto } from './models/create-customer.dto';
import { CustomerCredentials } from './models/customer-credentials.model';

const SELECT_CUSTOMER_EXCLUDE_PWD = {
  id: true,
  email: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class CustomerService {
  constructor(private prismaService: PrismaService) {}

  async getCustomersByIds(id: string[]): Promise<Customer[]> {
    const orWhere = id.map((id) => ({ id }));

    try {
      return await this.prismaService.customer.findMany({
        where: { OR: orWhere },
        select: SELECT_CUSTOMER_EXCLUDE_PWD,
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        err.message ?? 'Something went wrong during prisma query',
      );
    }
  }

  async getCustomerByEmail(email: string): Promise<Customer | null> {
    try {
      return await this.prismaService.customer.findUnique({
        where: { email },
        select: SELECT_CUSTOMER_EXCLUDE_PWD,
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        err.message ?? 'Something went wrong during prisma query',
      );
    }
  }

  async getCustomerCredentials(
    email: string,
  ): Promise<CustomerCredentials | null> {
    try {
      return await this.prismaService.customer.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          hashedPassword: true,
        },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        err.message ?? 'Something went wrong during prisma query',
      );
    }
  }

  async createCustomer(data: CreateCustomerDto): Promise<Customer> {
    try {
      return await this.prismaService.customer.create({
        data,
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        err.message ?? 'Something went wrong during prisma query',
      );
    }
  }
}
