import { Controller, Post, Body, Headers, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';

@Controller('payments')
export class PaymentsController {
    constructor(
        private readonly paymentsService: PaymentsService,
        private readonly ordersService: OrdersService
    ) { }

    @Post('create-payment-intent')
    async createPaymentIntent(@Body() body: { amount: number; currency: string; metadata?: any }) {
        return this.paymentsService.createPaymentIntent(body.amount, body.currency, body.metadata);
    }

    @Post('webhook')
    async handleWebhook(@Body() event: any) {
        // In a real app, you MUST verify the signature using stripe.webhooks.constructEvent
        // and the raw body. For this MVP, we are using the parsed body directly.

        console.log('Received Webhook Event:', event.type);

        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            const metadata = paymentIntent.metadata || {};

            console.log('Payment Succeeded:', paymentIntent.id);

            // Create Order
            await this.ordersService.createOrder({
                userId: metadata.userId || 'guest',
                stripePaymentIntentId: paymentIntent.id,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                status: 'paid',
                items: metadata.items ? JSON.parse(metadata.items) : [], // Metadata stores strings, so we parse JSON
            });

            console.log('Order created for:', paymentIntent.id);
        }

        return { received: true };
    }
}
