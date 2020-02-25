import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiModelProperty, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { IsEmail, IsNotEmpty } from 'class-validator'

import { register, sessionLogin } from '../auth.module/okta-client';
import { UserModel } from './user-model';
import { assertUser } from './assert-user';

/*
 DTO is short for Data Transfer Object
 DTO is an object that carries data between processes
 In the context of web apps, it's used to document type of data to be transferred between backend and frontend
 */
export class UserRegisterDto {
  @ApiModelProperty()
  @IsEmail()
  email: string;

  @ApiModelProperty()
  @IsNotEmpty()
  password: string;

  @ApiModelProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiModelProperty()
  @IsNotEmpty()
  lastName: string;
}

@Controller('users')
export default class UserController {
  @ApiResponse({ type: UserModel, status: 201 })
  @Post()
  async create(@Body() userData: UserRegisterDto, @Req() request: Request) {
    const { email, password, firstName, lastName } = userData;
    const { id: oktaUserId } = await register({ email, password, firstName, lastName });
    const user = await assertUser(oktaUserId);
    const { sessionId } = await sessionLogin({ email, password });
    request.res.cookie('sessionId', sessionId);

    return { id: user.id, email, firstName, lastName };
  }
}
