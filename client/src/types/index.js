import PropTypes from "prop-types";

// eslint-disable-next-line import/prefer-default-export
export const linkObject = PropTypes.shape({
  name: PropTypes.string.isRequired,
  dest: PropTypes.string.isRequired,
  element: PropTypes.node.isRequired,
  icon: PropTypes.objectOf((prop) => {
    if (!prop.displayName.includes("Icon")) {
      return new Error(
        `prop icon should be of type Icon. Got displayName: ${prop.displayName}`
      );
    }
    return true;
  }),
});
