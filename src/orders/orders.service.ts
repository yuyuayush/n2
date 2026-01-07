import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrdersService {
    constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) { }

    // Called by Stripe Webhook
    async createOrder(data: any) {
        const newOrder = new this.orderModel(data);
        return newOrder.save();
    }

    async getOrdersByUser(userId: string) {
        return this.orderModel.find({ userId }).sort({ createdAt: -1 }).exec();
    }
}
