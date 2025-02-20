import { Controller, Get, Post, Body, Param, Inject, Query, NotImplementedException, ParseUUIDPipe, Patch } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { PaginationDto } from 'src/common';
@Controller('orders')
export class OrdersController {

    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy
    ) {}

    @Post()
    create(@Body() createOrderDto: CreateOrderDto) {
        try {
            return this.client.send('createOrder', createOrderDto);
        } catch (error) {
            throw new RpcException(error);
        }
    }

    @Get()
    async findAll(@Query() orderPaginationDto: OrderPaginationDto) {
        try {

            const order = await firstValueFrom(
                this.client.send('findAllOrders', orderPaginationDto)
            );

            return order;
        } catch (error) {
            throw new RpcException(error);
        }
    }

    @Get('id/:nIdOrder')
    async findOne(@Param('nIdOrder', ParseUUIDPipe) nIdOrder: string) {
        try {
            
            const order = await firstValueFrom(
                this.client.send( 'findOneOrder', { nIdOrder } )
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

            return this.client.send('findAllOrders', {
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
            return this.client.send('changeOrderStatus', { nIdOrder, sStatus: statusDto.sStatus });
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
