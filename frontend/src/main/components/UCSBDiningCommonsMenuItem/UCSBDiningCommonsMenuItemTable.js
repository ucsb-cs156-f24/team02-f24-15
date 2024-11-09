import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/UCSBDiningCommonsMenuItemUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function UCSBDiningCommonsMenuItemTable({
  menuItems,
  currentUser,
  testid = "UCSBDiningCommonsMenuItemTable",
}) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/ucsbdiningcommonsmenuitem/edit/${cell.row.values.id}`);
  };

  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess }, // Needs test
    ["/api/ucsbdiningcommonsmenuitem/all"], // Needs test
  );

  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const columns = [
    {
      Header: "ID",
      accessor: "id", //needs test
    },
    {
      Header: "Dining Commons Code",
      accessor: "diningCommonsCode",
    },
    {
      Header: "Name",
      accessor: "name", //needs test
    },
    {
      Header: "Station",
      accessor: "station",
    },
  ];

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(ButtonColumn("Edit", "primary", editCallback, testid));
    columns.push(ButtonColumn("Delete", "danger", deleteCallback, testid));
  }

  return <OurTable data={menuItems} columns={columns} testid={testid} />;
}
