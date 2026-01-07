
import { Controller, Post, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post('sync')
    async syncUser(@Req() req) {
        const user = req.user;
        const email = user['https://n2Client/email'] || user.email;
        const name = user['https://n2Client/name'] || user.name || user.nickname;

        if (!user.sub) {
            throw new UnauthorizedException('Invalid token payload');
        }

        return this.usersService.syncUser({
            auth0Id: user.sub,
            email: email || 'no-email',
            name: name || 'User',
        });
    }
}
