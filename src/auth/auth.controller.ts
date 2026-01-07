import { Controller, Get, Post, Req, Res, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) {
        const data: any = await this.authService.googleLogin(req);
        // Redirect to frontend with token
        return res.redirect(`http://localhost:9002/products?token=${data.accessToken}`);
    }

    @Get('facebook')
    @UseGuards(AuthGuard('facebook'))
    async facebookAuth(@Req() req) { }

    @Get('facebook/callback')
    @UseGuards(AuthGuard('facebook'))
    async facebookAuthRedirect(@Req() req, @Res() res) {
        const data: any = await this.authService.facebookLogin(req);
        return res.redirect(`http://localhost:9002/products?token=${data.accessToken}`);
    }

    @Post("register")
    register(@Body() createUserDto: CreateUserDto): Promise<any> {
        return this.authService.userRegister(createUserDto);
    }

    @Post("verify")
    verify(@Body() body: { token: string }): Promise<any> {
        return this.authService.verifyUser(body.token);
    }

    @Post("login")
    login(@Body() loginUserDto: LoginUserDto): Promise<any> {
        return this.authService.userLogin(loginUserDto);
    }
}
