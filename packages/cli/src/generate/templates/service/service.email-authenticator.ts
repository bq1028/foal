import { EmailAuthenticator } from '@foal/core';

import { User } from '../entities';

export class /* upperFirstCamelName */ extends EmailAuthenticator<User> {
  entityClass = User;
}
