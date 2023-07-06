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
import PropTypes from "prop-types";
import ErrorAlert from "../alerts/ErrorAlert";
import { successToast } from "../alerts/Toasts";
import { addItem } from "../../reducers/itemsReducer";
import { useGlobalError } from "../../hooks";
import DrawerSelector from "./fields/DrawerSelector";

function ModalItemForm({ drawer }) {
  const cabinets = useSelector((state) => state.cabinets);
  const [error, setError] = useGlobalError("ADD ITEM");
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      cabinet: drawer?.cabinet,
      drawer: drawer?.id,
    },
  });

  const watchCabinet = watch("cabinet", null);

  const dispatch = useDispatch();
  const { onClose } = useModalContext();
  const submitForm = async (data) => {
    setError("");
    const success = await dispatch(addItem(data));
    if (success) {
      successToast(`Added item ${data.name}`);
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
            placeholder="Enter a name"
            {...register("name", { required: "Name is required" })}
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
        <DrawerSelector
          cabinetId={watchCabinet}
          error={errors.drawer}
          control={control}
        />
      </ModalBody>
      <ModalFooter>
        <Button isLoading={isSubmitting} type="submit">
          Submit
        </Button>
      </ModalFooter>
    </form>
  );
}

ModalItemForm.propTypes = {
  drawer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    cabinet: PropTypes.string.isRequired,
  }),
};

ModalItemForm.defaultProps = {
  drawer: null,
};

export default ModalItemForm;
