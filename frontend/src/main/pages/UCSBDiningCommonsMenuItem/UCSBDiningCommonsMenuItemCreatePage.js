import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemCreatePage({
  storybook = false,
}) {
  const objectToAxiosParams = (item) => ({
    url: "/api/ucsbdiningcommonmenuitem/post",
    method: "POST",
    params: {
      diningCommonsCode: item.diningCommonsCode,
      name: item.name,
      station: item.station,
    },
  });

  const onSuccess = (item) => {
    toast(
      `New UCSBDiningCommonsMenuItem Created - id: ${item.id} name: ${item.name}`,
    );
  };

  // Stryker disable next-line ArrayDeclaration
  const mutation = useBackendMutation(objectToAxiosParams, { onSuccess }, [
    // Stryker disable next-line StringLiteral
    "/api/ucsbdiningcommonmenuitem/all",
  ]);
  // Stryker restore

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/diningcommonsmenuitem" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New UCSB Dining Commons Menu Item</h1>
        <UCSBDiningCommonsMenuItemForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
