// import { OrderStatus } from "@prisma/client";
import { ArrayMinSize, IsArray, ValidateNested } from "class-validator";
// import { OrderStatusList } from "../enum/order.enum";
import { Type } from "class-transformer";
import { OrderItemDto } from "./";

export class CreateOrderDto {

    // @IsNumber()
    // @IsPositive()
    // nTotalAmount    : number;

    // @IsNumber()
    // @IsPositive()
    // nTotalItems     : number;

    // @IsEnum( OrderStatusList, {
    //     message: `Possible status values are ${ OrderStatusList }`
    // })
    // @IsOptional()
    // sStatus         : OrderStatus = OrderStatus.PENDING

    // @IsBoolean()
    // @IsOptional()
    // bPaid           : boolean = false;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type( () => OrderItemDto )
    items: OrderItemDto[]
    
}
