import { Bug } from '../bugs/entities/bug.entity';
import { Comment } from '../comments/entities/comment.entity';

export const databaseProviders = [
  {
    provide: 'BUG_REPOSITORY',
    useFactory: (connection) => connection.getRepository(Bug),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'COMMENT_REPOSITORY',
    useFactory: (connection) => connection.getRepository(Comment),
    inject: ['DATABASE_CONNECTION'],
  },
];
