import {
  FieldValues,
  FieldName,
  RegisterOptions,
  Control,
} from 'react-hook-form';

export type IForm = {
  username: string;
  password: string;
  email: string;
};

export type UseControllerProps<
  TFieldValues extends FieldValues = FieldValues
> = {
  name: FieldName<TFieldValues>;
  rules?: Exclude<RegisterOptions, 'valueAsNumber' | 'valueAsDate'>;
  onFocus?: () => void;
  defaultValue?: unknown;
  control?: Control<TFieldValues>;
  label: string;
  placeholder: string;
  type?: string;
};
