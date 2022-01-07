import { User } from '@prisma/client';

export class LoginUserDto implements User {
  id: number;
  username: string;
  bio: string;
  email: string;
  password: string;
  image: string;
  token: string;
}
