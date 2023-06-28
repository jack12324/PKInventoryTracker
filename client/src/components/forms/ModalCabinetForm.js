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
  useModalContext,
} from "@chakra-ui/react";

function ModalCabinetForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const { onClose } = useModalContext();
  const submitForm = async (data) => {
    console.log(data);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <ModalBody>
        <FormControl isInvalid={errors.cabinetName}>
          <FormLabel htmlFor="cabinetName">Name</FormLabel>
          <Input
            id="cabinetName"
            placeholder="Enter a name for the Cabinet"
            {...register("cabinetName", { required: "Name is required" })}
          />
          <FormErrorMessage>
            {errors.cabinetName && errors.cabinetName.message}
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
