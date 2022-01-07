import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    // TODO - Use encrypted password
    if (user && user.password === pass) {
      const { email, ...result } = user;
      return result;
    }
    return null;
  }
}
