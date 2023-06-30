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
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ErrorAlert from "../alerts/ErrorAlert";

function ModalDrawerForm() {
  const globalError = useSelector((state) => state.error);
  const cabinets = useSelector((state) => state.cabinets);
  const [error, setError] = useState("");
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

  useEffect(() => {
    if (globalError.active && globalError.scope === "ADD DRAWER") {
      setError(globalError.message);
    }
  }, [globalError]);

  // const dispatch = useDispatch();
  // const { onClose } = useModalContext();
  const submitForm = async (data) => {
    setError("");
    console.log(data);
    // const success = await dispatch(addCabinet(data));
    // if (success) {
    //  successToast(`Added drawer${data.name ? ` ${data.name}` : ""}`);
    //  onClose();
    // }
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
