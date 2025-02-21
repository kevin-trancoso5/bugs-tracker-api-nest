import { Module } from '@nestjs/common';
import { CommentsModule } from './comments/comments.module';
import { DatabaseModule } from './database/database.module';
import { BugsModule } from './bugs/bugs.module';

@Module({
  imports: [DatabaseModule, CommentsModule, BugsModule],
})
export class AppModule {}
