/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ModalBody,
  ModalFooter,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  useModalContext,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { addCabinet } from "../../reducers/cabinetsReducer";
import { successToast } from "../alerts/Toasts";
import ErrorAlert from "../alerts/ErrorAlert";

function ModalCabinetForm() {
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      numDrawers: 1,
    },
  });

  const dispatch = useDispatch();
  const { onClose } = useModalContext();
  const submitForm = async (data) => {
    try {
      dispatch(addCabinet(data));
      setError("");
      successToast(`Added cabinet ${data.name}`);
      onClose();
    } catch (err) {
      if (err?.response?.data?.error?.message) {
        setError(err.response.data.error.message);
      } else {
        setError("There was an error adding this cabinet");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      {error && <ErrorAlert msg={error} />}
      <ModalBody>
        <FormControl isInvalid={errors.name}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            id="name"
            placeholder="Enter a name/identifier for the cabinet"
            {...register("name", { required: "Name is required" })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.numDrawers}>
          <FormLabel htmlFor="numDrawers">Number of Drawers</FormLabel>
          <NumberInput
            min={1}
            max={25}
            defaultValue={1}
            clampValueOnBlur={false}
          >
            <NumberInputField
              id="numDrawers"
              placeholder="Number of drawers in cabinet"
              {...register("numDrawers", {
                required: "Number of drawers is required",
                min: {
                  value: 0,
                  message: "Cabinet must have at least one drawer",
                },
                max: {
                  value: 25,
                  message: "Cabinet can have at most 25 drawers",
                },
              })}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormErrorMessage>
            {errors.numDrawers && errors.numDrawers.message}
          </FormErrorMessage>
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button isLoading={isSubmitting} type="submit">
          Add a Cabinet
        </Button>
      </ModalFooter>
    </form>
  );
}

export default ModalCabinetForm;
