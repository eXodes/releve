import type { CreateUserDto } from "$module/user/dto/create-user.dto";

export interface UpdateUserDto extends Partial<CreateUserDto> {
    uid: string;
}
