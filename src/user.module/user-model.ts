import { ApiModelProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';

import { PhotoModel } from '../photo.module/photo-model';

@Entity({ name: 'users' })
export class UserModel {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column({ unique: true })
  oktaId: string;

  @OneToMany(() => PhotoModel, photo => photo.owner)
  photos: Promise<Array<PhotoModel>>;

  @ManyToMany(() => UserModel, user => user.likedPhotos)
  likedPhotos: Promise<Array<PhotoModel>>;
}
