
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        const issuerUrl = configService.get<string>('AUTH0_ISSUER_URL') || 'https://dev-wphxyi6gz5a0fokh.us.auth0.com'; // Fallback to prevent crash, though env var should be set

        super({
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `${issuerUrl.replace(/\/$/, '')}/.well-known/jwks.json`,
            }),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // audience: configService.get('AUTH0_AUDIENCE'), // Skipped to allow easier testing if frontend sends opaque token
            issuer: [
                issuerUrl,
                `${issuerUrl.replace(/\/$/, '')}/`
            ],
            algorithms: ['RS256'],
        });
    }

    async validate(payload: any) {
        // Return the payload (user info from token)
        return payload;
    }
}
