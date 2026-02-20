import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Param,
  Patch,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';
import { PrismaService } from '../../common/prisma/prisma.service';

@ApiTags('upload')
@Controller({ path: 'upload', version: '1' })
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Upload a general image (returns URL)
   */
  @Post('image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string' },
      },
    },
  })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    const result = await this.uploadService.uploadImage(file, folder || 'overline');
    return result;
  }

  /**
   * Upload shop logo
   */
  @Patch('shop/:shopId/logo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  async uploadShopLogo(
    @Param('shopId') shopId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) throw new NotFoundException('Shop not found');

    const result = await this.uploadService.uploadImage(file, 'overline/shops/logos');

    await this.prisma.shop.update({
      where: { id: shopId },
      data: { logoUrl: result.url },
    });

    return { logoUrl: result.url };
  }

  /**
   * Upload shop cover image
   */
  @Patch('shop/:shopId/cover')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  async uploadShopCover(
    @Param('shopId') shopId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) throw new NotFoundException('Shop not found');

    const result = await this.uploadService.uploadImage(file, 'overline/shops/covers');

    await this.prisma.shop.update({
      where: { id: shopId },
      data: { coverUrl: result.url },
    });

    return { coverUrl: result.url };
  }
}
