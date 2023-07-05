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
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { editCabinet } from "../../reducers/cabinetsReducer";
import { successToast } from "../alerts/Toasts";
import ErrorAlert from "../alerts/ErrorAlert";
import { clearError } from "../../reducers/errorReducer";

function ModalEditCabinetForm({ cabinet }) {
  const globalError = useSelector((state) => state.error);
  const [error, setError] = useState("");
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

  useEffect(() => {
    if (globalError.active && globalError.scope === "EDIT CABINET") {
      setError(globalError.message);
      dispatch(clearError());
    }
  }, [globalError]);

  const { onClose } = useModalContext();
  const submitForm = async (data) => {
    setError("");
    const success = await dispatch(editCabinet({ ...data, id: cabinet.id }));
    if (success) {
      successToast(`Cabinet name updated to ${data.name}`);
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
            placeholder={`Enter a new name/identifier to replace "${cabinet.name}"`}
            {...register("name", { required: "Name is required" })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button isLoading={isSubmitting} type="submit">
          Save Changes
        </Button>
      </ModalFooter>
    </form>
  );
}
ModalEditCabinetForm.propTypes = {
  cabinet: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    drawers: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default ModalEditCabinetForm;
