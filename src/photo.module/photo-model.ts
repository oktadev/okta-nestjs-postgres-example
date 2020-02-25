import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

import { UserModel } from '../user.module/user-model';

@Entity({ name: 'photos' })
export class PhotoModel {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column()
  name: string;

  @Column({ type: 'text', select: false })
  base64Content: string;

  @ApiModelProperty()
  @Column({ unique: true })
  slug: string;

  @ApiModelProperty()
  url: string;

  @ApiModelProperty()
  @Column()
  ownerId: number;

  @ManyToOne(() => UserModel, user => user.photos)
  owner: Promise<UserModel>;

  @JoinTable()
  @ManyToMany(() => UserModel, user => user.likedPhotos)
  likedBy: Promise<Array<UserModel>>;
}
