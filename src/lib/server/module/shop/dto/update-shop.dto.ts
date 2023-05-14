import type { CreateShopDto } from "$module/shop/dto/create-shop.dto";

export interface UpdateShopDto extends Partial<CreateShopDto> {
    uid: string;
}
