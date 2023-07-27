import { Customer } from 'src/modules/customer/models/customer.model';
import { Team } from './team.model';

export class TeamWithAudit extends Team {
  customers: (Customer & { clicks: number })[];
}
