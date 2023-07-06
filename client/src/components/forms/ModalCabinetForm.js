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
import { addCabinet } from "../../reducers/cabinetsReducer";
import { successToast } from "../alerts/Toasts";
import ErrorAlert from "../alerts/ErrorAlert";
import { useGlobalError } from "../../hooks";

function ModalCabinetForm() {
  const [error, setError] = useGlobalError("ADD CABINET");
  const dispatch = useDispatch();
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

  const { onClose } = useModalContext();
  const submitForm = async (data) => {
    setError("");
    const success = await dispatch(addCabinet(data));
    if (success) {
      successToast(`Added cabinet ${data.name}`);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <ModalBody>
        {error && <ErrorAlert msg={error} />}
        <FormControl isInvalid={errors.name} isRequired>
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
        <FormControl isInvalid={errors.numDrawers} isRequired>
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
                valueAsNumber: true,
                validate: (value) =>
                  (Number.isInteger(parseFloat(value, 10)) &&
                    parseInt(value, 10) > 0) ||
                  "Number of drawers must be a positive integer",
                min: {
                  value: 1,
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
