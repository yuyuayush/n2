import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
    @Prop({ required: true })
    userId: string; // Auth0 User ID

    @Prop({ required: true })
    stripePaymentIntentId: string;

    @Prop({ required: true })
    amount: number; // In cents

    @Prop({ required: true })
    currency: string;

    @Prop({ required: true })
    status: string; // 'pending', 'paid', 'failed'

    @Prop({ type: [{ productId: String, quantity: Number, price: Number }] })
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
