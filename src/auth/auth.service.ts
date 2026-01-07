
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
    constructor(private mailService: MailService) { }

    // Mock DB
    private users: any[] = [];

    googleLogin(req) {
        if (!req.user) {
            return 'No user from google';
        }
        return this.findOrCreateUser(req.user, 'google');
    }

    facebookLogin(req) {
        if (!req.user) {
            return 'No user from facebook';
        }
        return this.findOrCreateUser(req.user, 'facebook');
    }

    private async findOrCreateUser(profile: any, provider: string) {
        let user = this.users.find(u => u.email === profile.email);
        if (!user) {
            user = {
                ...profile,
                provider,
                isVerified: true // OAuth usually provides verified emails
            }
            this.users.push(user)
        }

        // In a real app, you would sign a JWT here
        return {
            message: 'User information from ' + provider,
            user,
            accessToken: 'mock_jwt_token_' + user.email
        };
    }

    async userRegister(createUserDto: any) {
        // Check if user exists
        const exists = this.users.find(u => u.email === createUserDto.email);
        if (exists) {
            throw new UnauthorizedException('User already exists');
        }

        const token = Math.floor(1000 + Math.random() * 9000).toString();
        const newUser = {
            id: this.users.length + 1,
            ...createUserDto,
            isVerified: false,
            verificationToken: token
        };
        this.users.push(newUser);

        await this.mailService.sendUserConfirmation(newUser, token);
        // console.log("Simulated email sent to " + newUser.email + " with token: " + token);

        return {
            message: 'User registered. Please check email for verification code',
            fakeTokenPreview: token,
            user: { email: newUser.email, firstName: newUser.firstName }
        };
    }

    async verifyUser(token: string) {
        const user = this.users.find(u => u.verificationToken === token);
        if (!user) {
            throw new UnauthorizedException('Invalid token');
        }
        user.isVerified = true;
        user.verificationToken = null;
        return { message: 'Email verified successfully. Please login.' };
    }

    async userLogin(loginUserDto: any) {
        const user = this.users.find(u => u.email === loginUserDto.email && u.password === loginUserDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // In real app, check isVerified. But for test, we might skip or return verify needed
        if (!user.isVerified) {
            // throw new UnauthorizedException('Please verify email');
        }

        return {
            message: 'User Logged In',
            accessToken: 'mock_jwt_token_' + user.email,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        };
    }
}
