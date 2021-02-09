import { User } from '../entities/User';
import { myContext } from 'src/types/types';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import argon2 from 'argon2';

@InputType()
class UsernameAndPasswordInputs {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() { req, em }: myContext) {
    if (!req.session!.userId) {
      return null;
    }
    const user = em.findOne(User, { id: req.session!.userId });
    return user;
  }

  @Query(() => [User])
  users(@Ctx() { em }: myContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('inputs') inputs: UsernameAndPasswordInputs,
    @Ctx() { em, req }: myContext
  ): Promise<UserResponse> {
    if (inputs.username.length < 3) {
      return {
        errors: [
          { field: 'username', message: 'length must be greater than 2' },
        ],
      };
    }
    if (inputs.password.length < 6) {
      return {
        errors: [
          { field: 'password', message: 'length must be greater than 5' },
        ],
      };
    }
    const hashedPassword = await argon2.hash(inputs.password);
    const user = em.create(User, {
      username: inputs.username,
      password: hashedPassword,
    });
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.code === '23505') {
        return {
          errors: [
            {
              field: 'username',
              message: 'user name already taken.',
            },
          ],
        };
      }
    }

    req.session!.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('inputs') inputs: UsernameAndPasswordInputs,
    @Ctx() { em, req }: myContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: inputs.username });
    if (!user) {
      return { errors: [{ field: 'username', message: `user doesn't exist` }] };
    }
    const passwordCheck = await argon2.verify(user.password, inputs.password);
    if (!passwordCheck) {
      return { errors: [{ field: 'password', message: 'incorrect password' }] };
    }

    req.session!.userId = user.id;

    return { user };
  }
}
