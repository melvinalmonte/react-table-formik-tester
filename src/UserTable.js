import {
  Box,
  Center,
  Flex,
  HStack,
  IconButton,
  Input,
  Select,
  Spacer,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { usePagination, useTable, useRowSelect } from "react-table";
import {
  BiChevronLeft,
  BiChevronRight,
  BiChevronsRight,
  BiChevronsLeft,
} from "react-icons/bi";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

const UserTable = ({ data, columns }) => {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  const [selected, setSelected] = React.useState([]);
  React.useEffect(() => {
    setSelected(selectedFlatRows.map((item) => item.original))
  }, [selectedFlatRows]);

  return (
    <>

      <Flex>
        <Spacer />
        <Box p={5}>
          <Select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50, 200].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Box>
      </Flex>
      <Box h="32.5rem" overflow="auto">
        <Table variant="striped" {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th bg="white" color="black" {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
      <Center p={10}>
        <HStack>
          <IconButton
            aria-label="Go to first page"
            icon={<BiChevronsLeft />}
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          />
          <IconButton
            aria-label="Go to first page"
            icon={<BiChevronLeft />}
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          />
          <Text>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </Text>
          <IconButton
            aria-label="Go to first page"
            icon={<BiChevronRight />}
            onClick={() => nextPage()}
            disabled={!canNextPage}
          />
          <IconButton
            aria-label="Go to first page"
            icon={<BiChevronsRight />}
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          />
          <Box>
            <Input
              w="75px"
              defaultValue={pageIndex + 1}
              placeholder="Go to"
              type="number"
              size="md"
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
            />
          </Box>
        </HStack>
      </Center>
    </>
  );
};

export default UserTable;
