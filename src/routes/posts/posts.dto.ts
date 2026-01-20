import { Type } from "class-transformer";
import { PostModel } from "src/shared/model/post.model";
import { UserModel } from "src/shared/model/user.model";

export class GetPostItemDTO extends PostModel {
    @Type(() => UserModel)
    author: Omit<UserModel, 'password'>

    constructor(partial: Partial<GetPostItemDTO>) {
        super(partial);
        Object.assign(this, partial);
    }
}