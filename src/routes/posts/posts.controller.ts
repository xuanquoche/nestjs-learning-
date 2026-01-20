import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { PostsService } from './posts.service'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { AUTH_TYPE, ConditionGuard } from 'src/shared/constants/auth.constant'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { GetPostItemDTO } from './posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Auth([AUTH_TYPE.Bearer, AUTH_TYPE.ApiKey], { condition: ConditionGuard.Or })
  @Get()
  getPosts(@ActiveUser('userId') userId: number) {
    return this.postsService.getPosts(userId).then((posts) => {
      return posts.map((post) => new GetPostItemDTO(post))
    })
  }

  @Post()
  @Auth([AUTH_TYPE.Bearer])
  createPost(@Body() body: any, @ActiveUser('userId') userId: number) {
    return this.postsService.createPost(body, userId)
  }

  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsService.getPost(id)
  }

  @Put(':id')
  updatePost(@Param('id') id: string, @Body() body: any) {
    return this.postsService.updatePost(id, body)
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id)
  }
}
