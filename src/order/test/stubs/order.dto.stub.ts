import { CreateOrderDto } from "../../../order/dto/create-order.dto";

export function createOrderDTOStub (productsDto:[{productId: string, count: number}]): CreateOrderDto {
    return {
        description: "some desc",
        products: productsDto
    }

}
 