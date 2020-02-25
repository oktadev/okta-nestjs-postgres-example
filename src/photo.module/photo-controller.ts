import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
  Req,
  Get, Param, NotFoundException, Res
} from '@nestjs/common';
import { ApiImplicitFile, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import crypto from 'crypto';
import { getManager } from 'typeorm';
import express from 'express';

import { PhotoModel } from './photo-model';
import { IsAuthenticatedGuard } from '../auth.module/is-authenticated-guard';

export interface IFileObject {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Controller('photos')
export default class PhotoController {
  @UseInterceptors(FileInterceptor('photo'))
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, type: PhotoModel })
  @ApiImplicitFile({ name: 'photo', required: true, description: 'A photo to be posted' })
  @UseGuards(IsAuthenticatedGuard)
  async create(@UploadedFile() file: IFileObject, @Req() req) {
    const { buffer, originalname } = file;
    if (!buffer || !originalname) {
      throw new BadRequestException('File must have a name and content');
    }

    const photo = new PhotoModel();
    photo.base64Content = buffer.toString('base64');
    photo.name = originalname;
    photo.slug = crypto.randomBytes(16).toString('hex');
    photo.ownerId = req.user.id;
    const manager = getManager();
    return await manager.save(photo);
  }

  @ApiResponse({ status: 200 })
  @Get('download/:slug')
  async download(@Param('slug') slug: string, @Res() res: express.Response) {
    if (!slug) {
      throw new BadRequestException('Missing `slug` URL parameter');
    }

    const manager = getManager();

    const photo = await manager.findOne(PhotoModel, { where: { slug }, select: ['base64Content'] });
    if (!photo) {
      throw new NotFoundException('No photo with slug ' + slug);
    }

    res.write(Buffer.from(photo.base64Content, 'base64'));
    res.end();
  }

  @ApiResponse({ type: PhotoModel, status: 200, isArray: true })
  @Get()
  async findAll() {
    const manager = getManager();
    const photos = await manager.find(PhotoModel);
    return photos.map(photo => ({ ...photo, url: `http://localhost:3000/photos/download/${photo.slug}` }));
  }

  @ApiResponse({ status: 201 })
  @Post(':photoId/likes')
  @UseGuards(IsAuthenticatedGuard)
  async createLike(@Param('photoId') photoId: string, @Req() req: express.Request) {
    const manager = getManager();
    const photo = await manager.findOne(PhotoModel, { where: { id: photoId } });
    if (!photo) {
      throw new NotFoundException('Photo with id ' + photoId + ' does not exist');
    }
    const likedBy = await photo.likedBy;
    likedBy.push(req['user']);
    await manager.save(photo);

    return { liked: true };
  }

  @ApiResponse({ type: Number, status: 200, isArray: true })
  @Get(':photoId/likes')
  async listLikes(@Param('photoId') photoId: string) {
    const manager = getManager();
    const photo = await manager.findOne(PhotoModel, { where: { id: photoId } });
    if (!photo) {
      throw new NotFoundException('Photo with id ' + photoId + ' does not exist');
    }
    return (await photo.likedBy).map(user => user.id);
  }
}
