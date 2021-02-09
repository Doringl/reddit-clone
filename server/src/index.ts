import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import express from 'express';
import { __prod__ } from './constants';
import mikroConfig from './mikro-orm.config';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/HelloResolver';
import { PostResolver } from './resolvers/PostResolver';
import { UserResolver } from './resolvers/UserResolver';
import redis from 'redis';
import session from 'express-session';
import { myContext } from './types/types';

(async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();
  const app = express();
  app.listen(4000);

  let RedisStore = require('connect-redis')(session);
  let redisClient = redis.createClient();

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365 * 7,
        sameSite: 'lax',
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: 'aıerugyap9ş8dfıgjaşoıfguşakdfg',
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): myContext => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({ app });

  //const post = orm.em.create(Post, { title: 'my title' });
  //await orm.em.persistAndFlush(post);

  //const post = await orm.em.find(Post, {});
  //console.log(post);
})().catch((error) => console.log(error));
