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
import { addItem } from "../../reducers/itemsReducer";
import { useGlobalError } from "../../hooks";

function ModalItemForm() {
  const cabinets = useSelector((state) => state.cabinets);
  const drawers = useSelector((state) => state.drawers);
  const [error, setError] = useGlobalError("ADD ITEM");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      cabinet: null,
      drawer: null,
    },
  });

  const watchCabinet = watch("cabinet", null);
  const filteredDrawers = drawers
    .filter((d) =>
      cabinets.find((c) => c.id === watchCabinet)?.drawers?.includes(d.id)
    )
    ?.sort((a, b) => b.position - a.position);

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
        <FormControl
          isInvalid={errors.drawer}
          isRequired
          isDisabled={!watchCabinet}
        >
          <FormLabel htmlFor="drawer">Drawer</FormLabel>
          <Select
            placeholder="Select Drawer"
            id="drawer"
            {...register("drawer", { required: "Drawer is required" })}
          >
            {filteredDrawers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.position}
              </option>
            ))}
          </Select>
          <FormErrorMessage>
            {errors.drawer && errors.drawer.message}
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

export default ModalItemForm;
