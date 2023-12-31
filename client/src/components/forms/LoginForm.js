/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../reducers/userReducer";
import ErrorAlert from "../alerts/ErrorAlert";
import { successToast } from "../alerts/Toasts";
import PasswordInput from "./fields/PasswordInput";

function LoginForm() {
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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitForm = async (data) => {
    try {
      await dispatch(loginUser(data));
      setError("");
      successToast("Log in successful");
      navigate("/items");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <VStack as="form" onSubmit={handleSubmit(submitForm)} spacing={4}>
      {error && <ErrorAlert msg={error} />}
      <FormControl isInvalid={errors.username}>
        <FormLabel htmlFor="username">Username</FormLabel>
        <Input
          id="username"
          placeholder="Enter Username"
          {...register("username", { required: "Username is required" })}
        />
        <FormErrorMessage>
          {errors.username && errors.username.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.password}>
        <FormLabel htmlFor="password">Password</FormLabel>
        <PasswordInput
          register={register}
          options={{ required: "Password is required" }}
        />
        <FormErrorMessage>
          {errors.password && errors.password.message}
        </FormErrorMessage>
      </FormControl>
      <Button
        isLoading={isSubmitting}
        type="submit"
        colorScheme="brand"
        w="100%"
      >
        Log in
      </Button>
    </VStack>
  );
}

export default LoginForm;
