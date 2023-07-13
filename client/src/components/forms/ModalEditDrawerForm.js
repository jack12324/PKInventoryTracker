/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  ModalBody,
  ModalFooter,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  useModalContext,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import ErrorAlert from "../alerts/ErrorAlert";
import { successToast } from "../alerts/Toasts";
import { editDrawer } from "../../reducers/drawersReducer";
import { useGlobalError } from "../../hooks";

function ModalEditDrawerForm({ drawer }) {
  const cabinets = useSelector((state) => state.cabinets);
  const [error, setError] = useGlobalError("EDIT DRAWER");
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: drawer.name,
      cabinet: drawer.cabinet,
      position: drawer.position,
    },
  });

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
        <FormControl isInvalid={errors.position} isRequired>
          <FormLabel htmlFor="position">Drawer Position</FormLabel>
          <NumberInput
            min={1}
            max={25}
            defaultValue={drawer.position}
            clampValueOnBlur={false}
            onChange={(value) => {
              setValue("position", value);
            }}
          >
            <NumberInputField
              id="position"
              placeholder="Position of drawer in cabinet"
              {...register("position", {
                required: "Position is required",
                valueAsNumber: true,
                validate: (value) =>
                  (Number.isInteger(parseFloat(value, 10)) &&
                    parseInt(value, 10) > 0) ||
                  "Position must be a positive integer",
                min: {
                  value: 1,
                  message: "Position must be at least one",
                },
                max: {
                  value: 25,
                  message: "Position must be at most 25",
                },
              })}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormHelperText>
            A position of 1 indicates the top drawer
          </FormHelperText>
          <FormErrorMessage>
            {errors.position && errors.position.message}
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
