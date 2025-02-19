import { Controller, Get, Post, Body, Param, Inject, Query, NotImplementedException, ParseUUIDPipe, Patch } from '@nestjs/common';
import { ORDER_SERVICE } from 'src/config';
import { ClientProxy, Payload, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { PaginationDto } from 'src/common';
@Controller('orders')
export class OrdersController {

    constructor(
        @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy
    ) {}

    @Post()
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersClient.send('createOrder', createOrderDto);
    }

    @Get()
    findAll(@Query() orderPaginationDto: OrderPaginationDto) {
        return this.ordersClient.send('findAllOrders', orderPaginationDto);
    }

    @Get('id/:nIdOrder')
    async findOne(@Param('nIdOrder', ParseUUIDPipe) nIdOrder: string) {
        try {
            
            const order = await firstValueFrom(
                this.ordersClient.send( 'findOneOrder', { nIdOrder } )
            );
            return order;

        } catch (error) {
            throw new RpcException(error);
        }
    }

    @Get(':sStatus')
    async findAllByStatus(
        @Param() statusDto: StatusDto
        ,@Query() paginationDto: PaginationDto
    ) {
        try {

            return this.ordersClient.send('findAllOrders', {
                ...paginationDto
                ,sStatus: statusDto.sStatus
            });

        } catch (error) {
            throw new RpcException(error);
        }
    }

    @Patch(':nIdOrder')
    changeStatus(
        @Param('nIdOrder', ParseUUIDPipe) nIdOrder: string
        ,@Body() statusDto: StatusDto 
    ){
        try {
            return this.ordersClient.send('changeOrderStatus', { nIdOrder, sStatus: statusDto.sStatus });
        } catch (error) {
            throw new RpcException(error);
        }
    }

    // @Patch(':id')
    // changeStatus(
    //     @Param('id', ParseUUIDPipe ) id: string,
    //     @Body() statusDto: StatusDto,
    // ) {
    //     try {
    //     return this.ordersClient.send('changeOrderStatus', { id, status: statusDto.status })
    //     } catch (error) {
    //     throw new RpcException(error);
    //     }
    // }
}
