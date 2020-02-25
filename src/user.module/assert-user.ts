import { getManager } from 'typeorm';
import { UserModel } from './user-model';

export async function assertUser(oktaUserId: string) {
  const manager = getManager();
  const existingUser = await manager.findOne(UserModel, { where: { oktaUserId } });
  if (existingUser) {
    return existingUser;
  }

  const user = new UserModel();
  user.oktaId = oktaUserId;
  return await manager.save(user);
}
