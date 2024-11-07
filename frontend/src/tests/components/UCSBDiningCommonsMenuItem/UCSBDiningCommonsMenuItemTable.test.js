import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBDiningCommonsMenuItemTable from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemTable";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import * as useBackend from "main/utils/useBackend";
import * as UCSBDiningCommonsMenuItemUtils from "main/utils/UCSBDiningCommonsMenuItemUtils";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBDiningCommonsMenuItemTable tests", () => {
  const queryClient = new QueryClient();

  test("renders table with data for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable
            menuItems={ucsbDiningCommonsMenuItemFixtures.threeItems}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Check that table headers are rendered
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Dining Commons Code")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Station")).toBeInTheDocument();

    // Check that data is rendered correctly
    expect(screen.getByText("ORT")).toBeInTheDocument();
    expect(screen.getByText("Italian Corner")).toBeInTheDocument();
    expect(screen.getByText("CAR")).toBeInTheDocument();
    expect(screen.getByText("Mexican Station")).toBeInTheDocument();

    // Check that buttons are not rendered
    expect(
      screen.queryByTestId(
        "UCSBDiningCommonsMenuItemTable-cell-row-0-col-Edit-button",
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(
        "UCSBDiningCommonsMenuItemTable-cell-row-0-col-Delete-button",
      ),
    ).not.toBeInTheDocument();
  });

  test("renders table with data for admin user and buttons", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable
            menuItems={ucsbDiningCommonsMenuItemFixtures.threeItems}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Check that table headers are rendered
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Dining Commons Code")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Station")).toBeInTheDocument();

    // Check that data is rendered correctly
    expect(screen.getByText("ORT")).toBeInTheDocument();
    expect(screen.getByText("Italian Corner")).toBeInTheDocument();
    expect(screen.getByText("CAR")).toBeInTheDocument();
    expect(screen.getByText("Mexican Station")).toBeInTheDocument();

    // Check that buttons are rendered
    const editButton = screen.getByTestId(
      "UCSBDiningCommonsMenuItemTable-cell-row-0-col-Edit-button",
    );
    const deleteButton = screen.getByTestId(
      "UCSBDiningCommonsMenuItemTable-cell-row-0-col-Delete-button",
    );

    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();

    // Check that buttons have correct Bootstrap variant classes
    expect(editButton).toHaveClass("btn-primary");
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("Edit button navigates to edit page", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable
            menuItems={ucsbDiningCommonsMenuItemFixtures.threeItems}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const editButton = screen.getByTestId(
      "UCSBDiningCommonsMenuItemTable-cell-row-0-col-Edit-button",
    );
    fireEvent.click(editButton);

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/menuitem/edit/2"),
    );
  });

  test("Delete button calls delete callback", async () => {
    const currentUser = currentUserFixtures.adminUser;

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onDelete("/api/ucsbdiningcommonsmenuitem", { params: { id: 2 } })
      .reply(200, { message: "MenuItem deleted" });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable
            menuItems={ucsbDiningCommonsMenuItemFixtures.threeItems}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const deleteButton = screen.getByTestId(
      "UCSBDiningCommonsMenuItemTable-cell-row-0-col-Delete-button",
    );
    fireEvent.click(deleteButton);

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].params).toEqual({ id: 2 });
  });

  // Additional test to ensure delete callback is not called for ordinary user
  test("Delete callback is not called for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;
    const axiosMock = new AxiosMockAdapter(axios);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable
            menuItems={ucsbDiningCommonsMenuItemFixtures.threeItems}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const deleteButton = screen.queryByTestId(
      "UCSBDiningCommonsMenuItemTable-cell-row-0-col-Delete-button",
    );
    expect(deleteButton).not.toBeInTheDocument();

    // Ensure delete callback does not trigger any axios calls
    expect(axiosMock.history.delete.length).toBe(0);
  });

  // Corrected test to ensure mutation setup is correct
  test("Correct API endpoint and params are used for delete", async () => {
    const currentUser = currentUserFixtures.adminUser;
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onDelete("/api/ucsbdiningcommonsmenuitem", { params: { id: 2 } })
      .reply(200, { message: "MenuItem deleted" });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable
            menuItems={ucsbDiningCommonsMenuItemFixtures.threeItems}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const deleteButton = screen.getByTestId(
      "UCSBDiningCommonsMenuItemTable-cell-row-0-col-Delete-button",
    );
    fireEvent.click(deleteButton);

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].url).toBe(
      "/api/ucsbdiningcommonsmenuitem",
    );
    expect(axiosMock.history.delete[0].params).toEqual({ id: 2 });
  });

  // Test to check if useBackendMutation is called correctly
  test("useBackendMutation is called with correct cache invalidation keys", () => {
    const useBackendMutationSpy = jest.spyOn(useBackend, "useBackendMutation");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable
            menuItems={ucsbDiningCommonsMenuItemFixtures.threeItems}
            currentUser={currentUserFixtures.adminUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(useBackendMutationSpy).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Object),
      ["/api/ucsbdiningcommonsmenuitem/all"],
    );

    useBackendMutationSpy.mockRestore();
  });

  // New test to check that the correct accessors are used for ID and Name
  test("Table columns use correct accessors", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable
            menuItems={ucsbDiningCommonsMenuItemFixtures.threeItems}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Check that ID and Name columns use correct accessors
    expect(
      screen.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-id"),
    ).toHaveTextContent("2");
    expect(
      screen.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-name"),
    ).toHaveTextContent("Pasta");
  });

  test("onDeleteSuccess is called on successful delete", async () => {
    const currentUser = currentUserFixtures.adminUser;

    // Spy on the onDeleteSuccess function
    const onDeleteSuccessSpy = jest.spyOn(
      UCSBDiningCommonsMenuItemUtils,
      "onDeleteSuccess",
    );

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onDelete("/api/ucsbdiningcommonsmenuitem", { params: { id: 2 } })
      .reply(200, { message: "MenuItem deleted" });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable
            menuItems={ucsbDiningCommonsMenuItemFixtures.threeItems}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const deleteButton = screen.getByTestId(
      "UCSBDiningCommonsMenuItemTable-cell-row-0-col-Delete-button",
    );
    fireEvent.click(deleteButton);

    // Wait for the delete mutation to be called
    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));

    // Log the arguments passed to onDeleteSuccess for debugging
    console.log("onDeleteSuccess arguments:", onDeleteSuccessSpy.mock.calls[0]);

    // Check that onDeleteSuccess was called with the correct message as the first argument
    expect(onDeleteSuccessSpy).toHaveBeenCalledTimes(1);
    expect(onDeleteSuccessSpy.mock.calls[0][0]).toEqual({
      message: "MenuItem deleted",
    });

    onDeleteSuccessSpy.mockRestore(); // Restore the original implementation
  });
});
