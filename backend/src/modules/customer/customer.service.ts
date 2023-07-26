import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Customer } from './models/customer.model';
import { CreateCustomerDto } from './models/create-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private prismaService: PrismaService) {}

  async getCustomerByEmail(email: string): Promise<Customer | null> {
    return await this.prismaService.customer.findUnique({
      where: { email },
    });
  }

  async createCustomer(data: CreateCustomerDto): Promise<Customer> {
    return await this.prismaService.customer.create({
      data,
    });
  }
}
