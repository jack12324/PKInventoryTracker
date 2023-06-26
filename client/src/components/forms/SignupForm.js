/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import usersService from "../../services/users";

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const submitForm = async (data) => {
    try {
      const response = await usersService.create(data);
      console.log(response);
    } catch (err) {
      console.error(err.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <FormControl isInvalid={errors.username}>
        <FormLabel htmlFor="username">Username</FormLabel>
        <Input
          id="username"
          placeholder="username"
          {...register("username", {
            required: "username is required",
            minLength: {
              value: 5,
              message: "username must be at least 5 characters",
            },
          })}
        />
        <FormErrorMessage>
          {errors.username && errors.username.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.password}>
        <FormLabel htmlFor="password">Password</FormLabel>
        <Input
          id="password"
          placeholder="password"
          {...register("password", { required: "password is required" })}
        />
        <FormErrorMessage>
          {errors.password && errors.password.message}
        </FormErrorMessage>
      </FormControl>
      <Button isLoading={isSubmitting} type="submit">
        Sign up
      </Button>
    </form>
  );
}

export default SignupForm;
