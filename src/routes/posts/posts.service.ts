import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}
  getPosts() {
    return this.prismaService.post.findMany()
  }

  createPost(body: any) {
    return this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: 1,
      },
    })
  }

  getPost(id: string) {
    return this.prismaService.post.findUnique({ where: { id: Number(id) } })
  }

  updatePost(id: string, body: any) {
    return this.prismaService.post.update({ where: { id: Number(id) }, data: body })
  }

  deletePost(id: string) {
    return this.prismaService.post.delete({ where: { id: Number(id) } })
  }
}
