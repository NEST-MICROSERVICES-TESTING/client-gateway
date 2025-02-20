import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
   
    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy
    ) {}

    @Post()
    createProduct(@Body() createProductDto: CreateProductDto) {
        return this.client.send( { cmd: 'create_product' }, createProductDto );
    }

    @Get()
    findAllProducts( @Query() paginationDto: PaginationDto ) {
        return this.client.send( { cmd: 'find_all_products'}, paginationDto );
    }

    @Get(':nIdProduct')
    async findOneProducts(@Param('nIdProduct') nIdProduct: string) {
        try {
            
            const product = await firstValueFrom(
                this.client.send( { cmd: 'find_one_product' }, { nIdProduct } )
            );
            return product;

        } catch (error) {
            throw new RpcException(error);
        }
    }

    @Patch(':nIdProduct')
    patchProduct(
        @Param('nIdProduct', ParseIntPipe) nIdProduct: number
        ,@Body() updateProductDto: UpdateProductDto
    ) {
        return this.client.send( { cmd: 'update_product'}, {
            nIdProduct
            ,...updateProductDto
        }).pipe(
            catchError( err => { throw new RpcException(err) })
        );
    }

    @Delete(':nIdProduct')
    deleteProduct(@Param('nIdProduct', ParseIntPipe) nIdProduct: number) {
        //return 'Esta función elimina el producto ' + nIdProduct;

        return this.client.send( { cmd: 'delete_product'}, {
            nIdProduct
        }).pipe(
            catchError( err => { throw new RpcException(err) })
        );
    }
}
