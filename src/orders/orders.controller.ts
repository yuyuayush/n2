import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getUserOrders(@Req() req) {
        const userId = req.user.sub;
        return this.ordersService.getOrdersByUser(userId);
    }
}
