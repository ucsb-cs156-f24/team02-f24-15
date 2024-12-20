import { toast } from "react-toastify";

export function onDeleteSuccess(message) {
  console.log(message);
  const successMessage =
    typeof message === "string" ? message : message.message;
  toast.success(successMessage);
}

export function cellToAxiosParamsDelete(cell) {
  return {
    url: "/api/ucsbdiningcommonsmenuitem",
    method: "DELETE",
    params: {
      id: cell.row.values.id,
    },
  };
}
