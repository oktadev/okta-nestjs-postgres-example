import { Body, Controller, Post, Req, UnauthorizedException } from '@nestjs/common';
import { ApiModelProperty, ApiResponse } from '@nestjs/swagger';
import { sessionLogin } from './okta-client';
import { Request } from 'express';

/*
 DTO is short for Data Transfer Object
 DTO is an object that carries data between processes
 In the context of web apps, it's used to document type of data to be transferred between backend and frontend
 */
export class LoginDto {
  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  password: string;
}

export class LoginResponseDto {
  @ApiModelProperty()
  sessionId: string;

  @ApiModelProperty()
  userEmail: string;

  @ApiModelProperty()
  userId: string
}

@Controller('login')
export default class AuthController {
  @Post()
  @ApiResponse({ type: LoginResponseDto, status: 201 })
  async login(@Body() data: LoginDto, @Req() request: Request): Promise<LoginResponseDto> {
    const { email, password } = data;
    try {
      const session = await sessionLogin({ email, password });
      request.res.cookie('sessionId', session.sessionId);
      return session;
    } catch (e) {
      console.log('login error', e);
      throw new UnauthorizedException('Invalid email or password');
    }
  }
}
