import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemCreatePage({
  storybook = false,
}) {
  const objectToAxiosParams = (menuItems) => ({
    url: "/api/ucsbdiningcommonsmenuitem/post",
    method: "POST",
    params: {
      diningCommonsCode: menuItems.diningCommonsCode,
      name: menuItems.name,
      station: menuItems.station,
    },
  });

  const onSuccess = (menuItems) => {
    toast(
      `New UCSBDiningCommonsMenuItem Created - id: ${menuItems.id} name: ${menuItems.name}`,
    );
  };

  // Stryker disable next-line ArrayDeclaration
  const mutation = useBackendMutation(objectToAxiosParams, { onSuccess }, [
    // Stryker disable next-line StringLiteral
    "/api/ucsbdiningcommonsmenuitem/all",
  ]);
  // Stryker restore

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsbdiningcommonsmenuitem" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create UCSBDiningCommonsMenuItems</h1>
        <UCSBDiningCommonsMenuItemForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
