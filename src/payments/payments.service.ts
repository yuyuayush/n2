import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
    private stripe: Stripe;

    constructor(private configService: ConfigService) {
        const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY') || 'sk_test_placeholder_key_replace_me';
        this.stripe = new Stripe(secretKey, {
            apiVersion: '2025-12-15.clover' as any, 
        });
    }

    async createPaymentIntent(amount: number, currency: string, metadata: any = {}) {
        if (!amount || !currency) {
            throw new Error('Amount and currency are required');
        }

        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount,
                currency,
                metadata, // Attach metadata (userId, products, etc.)
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            return {
                clientSecret: paymentIntent.client_secret,
            };
        } catch (error) {
            console.error('Stripe Error:', error);
            throw new Error(`Payment creation failed: ${error.message}`);
        }
    }
}
