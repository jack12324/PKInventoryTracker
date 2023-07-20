import {
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import Item from "../cards/Item";

function ItemsPage() {
  const allItems = useSelector((state) => state.items);
  const allDrawers = useSelector((state) => state.drawers);
  const allCabinets = useSelector((state) => state.cabinets);
  const [search, setSearch] = useState("");
  const sortFunction = (a, b) => {
    const aDrawer = allDrawers.find((d) => d.id === a?.drawer);
    const bDrawer = allDrawers.find((d) => d.id === b?.drawer);

    const aCabinet = allCabinets.find((c) => c.id === aDrawer?.cabinet);
    const bCabinet = allCabinets.find((c) => c.id === bDrawer?.cabinet);
    if (!aCabinet || !bCabinet || !aDrawer || !bDrawer) {
      return a.name > b.name ? 1 : -1;
    }
    if (aCabinet.id === bCabinet.id) {
      if (bDrawer.position === aDrawer.position) {
        return a.name > b.name ? 1 : -1;
      }
      return aDrawer.position - bDrawer.position;
    }
    return aCabinet.name > bCabinet.name ? 1 : -1;
  };
  const filteredItems = search
    ? allItems.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
      )
    : allItems;

  const items = [...filteredItems].sort(sortFunction);

  return (
    <>
      <Heading>Items</Heading>
      <InputGroup>
        <Input
          placeholder="Search for an item"
          value={search}
          onChange={({ target }) => setSearch(target.value)}
        />
        <InputRightElement>
          <SearchIcon color="gray.300" />
        </InputRightElement>
      </InputGroup>
      {items ? items.map((i) => <Item item={i} key={i.id} verbose />) : null}
    </>
  );
}

export default ItemsPage;
