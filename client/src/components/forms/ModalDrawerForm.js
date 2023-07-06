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
  Select,
  useModalContext,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import ErrorAlert from "../alerts/ErrorAlert";
import { successToast } from "../alerts/Toasts";
import { addDrawer } from "../../reducers/drawersReducer";
import { useGlobalError } from "../../hooks";

function ModalDrawerForm() {
  const cabinets = useSelector((state) => state.cabinets);
  const drawers = useSelector((state) => state.drawers);
  const dispatch = useDispatch();
  const [error, setError] = useGlobalError("ADD DRAWER");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      cabinet: null,
    },
  });

  const { onClose } = useModalContext();
  const submitForm = async (data) => {
    setError("");
    const position =
      1 +
      Math.max(
        0,
        ...drawers
          .filter((d) => d.cabinet === data.cabinet)
          .map((d) => d.position)
      );
    const success = await dispatch(addDrawer({ ...data, position }));
    if (success) {
      successToast(`Added drawer${data.name ? ` ${data.name}` : ""}`);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <ModalBody>
        {error && <ErrorAlert msg={error} />}
        <FormControl isInvalid={errors.name}>
          <FormLabel htmlFor="name">Name (Optional)</FormLabel>
          <Input
            id="name"
            placeholder="Enter a name/identifier for the drawer"
            {...register("name")}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.cabinet} isRequired>
          <FormLabel htmlFor="cabinet">Cabinet</FormLabel>
          <Select
            placeholder="Select Cabinet"
            id="cabinet"
            {...register("cabinet", { required: "Cabinet is required" })}
          >
            {cabinets.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>
            {errors.cabinet && errors.cabinet.message}
          </FormErrorMessage>
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button isLoading={isSubmitting} type="submit">
          Submit
        </Button>
      </ModalFooter>
    </form>
  );
}

export default ModalDrawerForm;
