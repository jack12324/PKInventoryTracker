/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import usersService from "../../services/users";
import { successToast } from "../alerts/Toasts";
import ErrorAlert from "../alerts/ErrorAlert";
import PasswordInput from "./fields/PasswordInput";

function SignupForm() {
  const [error, setError] = useState("");
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

  const navigate = useNavigate();

  const submitForm = async (data) => {
    try {
      await usersService.create(data);
      successToast("User added, please log in");
      navigate("/login");
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      {error && <ErrorAlert msg={error} />}
      <FormControl isInvalid={errors.username}>
        <FormLabel htmlFor="username">Username</FormLabel>
        <Input
          id="username"
          placeholder="Username"
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 5,
              message: "Username must be at least 5 characters",
            },
          })}
        />
        <FormErrorMessage>
          {errors.username && errors.username.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.password}>
        <FormLabel htmlFor="password">Password</FormLabel>
        <PasswordInput
          register={register}
          options={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          }}
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
