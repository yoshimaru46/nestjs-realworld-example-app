import { User } from '@prisma/client';

export class RegisterUserDto implements User {
  id: number;
  username: string;
  bio: string;
  email: string;
  password: string;
  image: string;
  token: string;
}
