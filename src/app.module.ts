import { Module } from '@nestjs/common';
import { CommentsModule } from './comments/comments.module';
import { DatabaseModule } from './database/database.module';
import { BugsModule } from './bugs/bugs.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, CommentsModule, BugsModule, AuthModule],
})
export class AppModule {}
