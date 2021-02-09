import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
} from '@chakra-ui/react';
import { useController } from 'react-hook-form';
import { UseControllerProps } from '../types/types';

interface InputFieldProps {}

export const InputField: React.FC<UseControllerProps> = (props) => {
  const { field, meta } = useController(props);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  return (
    <FormControl>
      <FormLabel htmlFor={props.name}>{props.label}</FormLabel>
      <InputGroup>
        <Input
          {...field}
          id={props.name}
          placeholder={props.placeholder}
          type={
            props.type !== 'password' ? props.type : show ? 'text' : props.type
          }
          errorBorderColor='crimson'
          isRequired={true}
          isInvalid={meta.invalid}
        />
        {props.type === 'password' ? (
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        ) : null}
      </InputGroup>
    </FormControl>
  );
};
