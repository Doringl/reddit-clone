import { Box, Button } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { IForm } from '../types/types';
import { useMutation } from 'urql';

interface RegisterProps {}

const REGISTER_MUTATION = `mutation Register($username: String!, $password: String!){
  register(inputs: { username: $username, password: $password }) {
    errors {
      field
      message
    }
    user {
      id
      createdAt
      updatedAt
      username
    }
  }
}`;

const Register: React.FC<RegisterProps> = ({}) => {
  const { handleSubmit, errors, control } = useForm<IForm>({
    defaultValues: { username: '', password: '', email: '' },
    mode: 'onSubmit',
  });
  const [, register] = useMutation(REGISTER_MUTATION);
  const onSubmit = (data) => {
    return register(data);
  };
  return (
    <Wrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          control={control}
          name='username'
          label='Username'
          placeholder='Enter Username'
          //rules={{ required: true, minLength: 3 }}
        />
        {/*errors.username?.type === 'minLength' && (
          <p>Your input must be larger then 3 characters</p>
        )*/}
        <Box mt='4'>
          <InputField
            control={control}
            name='password'
            label='Password'
            placeholder='Enter Password'
            type='password'
            //rules={{ required: true, minLength: 6 }}
          />
          {/*errors.password?.type === 'minLength' && (
            <p>Your input must be larger then 6 characters</p>
          )*/}
        </Box>
        <Button mt='4' type='submit' color='teal'>
          Register
        </Button>
      </form>
    </Wrapper>
  );
};

export default Register;
