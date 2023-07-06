/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
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
import { successToast } from "../alerts/Toasts";
import ErrorAlert from "../alerts/ErrorAlert";
import { editItem } from "../../reducers/itemsReducer";
import { useGlobalError } from "../../hooks";
import DrawerSelector from "./fields/DrawerSelector";

function ModalEditItemForm({ item }) {
  const cabinets = useSelector((state) => state.cabinets);
  const drawers = useSelector((state) => state.drawers);
  const drawer = drawers.find((d) => d.id === item.drawer);
  const [error, setError] = useGlobalError("EDIT ITEM");
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: item.name,
      cabinet: drawer.cabinet,
      drawer: item.drawer,
    },
  });

  const watchCabinet = watch("cabinet", null);

  const dispatch = useDispatch();
  const { onClose } = useModalContext();
  const submitForm = async (data) => {
    setError("");
    const success = await dispatch(editItem(item, { ...item, ...data }));
    if (success) {
      successToast(`Updated item`);
      onClose();
    }
  };

  const anyChange = () =>
    watch("name") !== item.name ||
    watch("cabinet") !== drawer.cabinet ||
    watch("drawer") !== item.drawer;

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <ModalBody>
        {error && <ErrorAlert msg={error} />}
        <FormControl isInvalid={errors.name} isRequired>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            id="name"
            placeholder="Enter a name for the item"
            {...register("name", { required: "Name is required" })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.cabinet} isRequired>
          <FormLabel htmlFor="cabinet">Cabinet</FormLabel>
          <Select
            id="cabinet"
            placeholder="Select a cabinet"
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
          error={errors.drawer}
          cabinetId={watchCabinet}
          control={control}
        />
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

ModalEditItemForm.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    drawer: PropTypes.string.isRequired,
  }).isRequired,
};

export default ModalEditItemForm;
