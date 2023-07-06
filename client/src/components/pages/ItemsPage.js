import { Heading } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import Item from "../cards/Item";

function ItemsPage() {
  const items = useSelector((state) =>
    [...state.items].sort((a, b) => (a.name > b.name ? 1 : -1))
  );

  return (
    <>
      <Heading>Items</Heading>
      {items ? items.map((i) => <Item item={i} key={i.id} verbose />) : null}
    </>
  );
}

export default ItemsPage;
