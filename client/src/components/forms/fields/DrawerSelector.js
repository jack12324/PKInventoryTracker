import { Controller } from "react-hook-form";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

function DrawerSelector({ control, error, cabinetId }) {
  const drawers = useSelector((state) => state.drawers);
  const filteredDrawers = drawers
    .filter((d) => d.cabinet === cabinetId)
    .sort((a, b) => b.position - a.position);

  return (
    <Controller
      control={control}
      name="drawer"
      rules={{ required: "Drawer is required" }}
      render={({ field }) => (
        <FormControl
          isInvalid={error}
          isRequired
          isDisabled={!cabinetId}
          id="drawer"
        >
          <FormLabel htmlFor="drawer">Drawer</FormLabel>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Select {...field} placeholder="Select a drawer">
            {filteredDrawers.map((d) => (
              <option key={d.id} value={d.id}>
                {`Drawer ${d.position}`}
                {d.name ? ` - ${d.name}` : ""}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{error && error.message}</FormErrorMessage>
        </FormControl>
      )}
    />
  );
}

DrawerSelector.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
  cabinetId: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  control: PropTypes.any.isRequired,
};

DrawerSelector.defaultProps = {
  error: null,
  cabinetId: null,
};
export default DrawerSelector;
