import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm.js";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemEditPage({
  storybook = false,
}) {
  let { id } = useParams();

  const {
    data: diningcommonsmenuitem,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/ucsbdiningcommonsmenuitem?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/ucsbdiningcommonsmenuitem`,
      params: {
        id,
      },
    },
  );

  const objectToAxiosPutParams = (diningcommonsmenuitem) => ({
    url: "/api/ucsbdiningcommonsmenuitem",
    method: "PUT",
    params: {
      id: diningcommonsmenuitem.id,
    },
    data: {
      id: diningcommonsmenuitem.id,
      diningCommonsCode: diningcommonsmenuitem.diningCommonsCode,
      name: diningcommonsmenuitem.name,
      station: diningcommonsmenuitem.station,
    },
  });

  const onSuccess = (diningcommonsmenuitem) => {
    toast(
      `DiningCommonsMenuItem Updated - id: ${diningcommonsmenuitem.id} name: ${diningcommonsmenuitem.name}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/ucsbdiningcommonsmenuitem?id=${id}`],
  );

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
        <h1>Edit DiningCommonsMenuItem</h1>
        {diningcommonsmenuitem && (
          <UCSBDiningCommonsMenuItemForm
            initialContents={diningcommonsmenuitem}
            submitAction={onSubmit}
            buttonLabel={"Update"}
          />
        )}
      </div>
    </BasicLayout>
  );
}
