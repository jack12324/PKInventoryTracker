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
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ErrorAlert from "../alerts/ErrorAlert";
import { successToast } from "../alerts/Toasts";
import { editDrawer } from "../../reducers/drawersReducer";

function ModalEditDrawerForm({ drawer }) {
  const globalError = useSelector((state) => state.error);
  const cabinets = useSelector((state) => state.cabinets);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: drawer.name,
      cabinet: drawer.cabinet,
      position: drawer.position,
    },
  });

  useEffect(() => {
    if (globalError.active && globalError.scope === "EDIT DRAWER") {
      setError(globalError.message);
    }
  }, [globalError]);

  const dispatch = useDispatch();
  const { onClose } = useModalContext();
  const submitForm = async (data) => {
    setError("");
    const success = await dispatch(editDrawer(drawer, { ...drawer, ...data }));
    if (success) {
      successToast(`Updated drawer`);
      onClose();
    }
  };

  const anyChange = () =>
    watch("name") !== drawer.name ||
    watch("cabinet") !== drawer.cabinet ||
    watch("position") !== drawer.position;

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
        <Button
          isLoading={isSubmitting}
          type="submit"
          isDisabled={!anyChange()}
        >
          Submit
        </Button>
      </ModalFooter>
    </form>
  );
}

ModalEditDrawerForm.propTypes = {
  drawer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    cabinet: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    position: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};
export default ModalEditDrawerForm;
