// src/tests/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemIndexPage.test.js

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UCSBDiningCommonsMenuItemIndexPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";
import { toast } from "react-toastify";

describe("UCSBDiningCommonsMenuItemIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const testId = "UCSBDiningCommonsMenuItemTable";

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const setupAdminUser = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
  });

  test("Renders with Create Button for admin user", async () => {
    const queryClient = new QueryClient();
    setupAdminUser();
    axiosMock.onGet("/api/ucsbdiningcommonsmenuitem/all").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Create UCSB Dining Commons Menu Item/),
      ).toBeInTheDocument();
    });
    const createButton = screen.getByText(
      /Create UCSB Dining Commons Menu Item/,
    );
    expect(createButton).toHaveAttribute(
      "href",
      "/ucsbdiningcommonsmenuitem/create",
    );
    expect(createButton).toHaveAttribute("style", "float: right;");
  });

  test("renders three menu items correctly for regular user", async () => {
    const queryClient = new QueryClient();
    setupUserOnly();
    axiosMock
      .onGet("/api/ucsbdiningcommonsmenuitem/all")
      .reply(200, ucsbDiningCommonsMenuItemFixtures.threeItems);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Wait for the table to be populated
    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`),
      ).toBeInTheDocument();
    });

    const expectedHeaders = ["ID", "Dining Commons Code", "Name", "Station"];
    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "2",
    );
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "3",
    );
    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      "4",
    );
  });

  test("renders empty table when backend unavailable, user only", async () => {
    const queryClient = new QueryClient();
    setupUserOnly();

    const restoreConsole = mockConsole();

    axiosMock
      .onGet("/api/ucsbdiningcommonsmenuitem/all")
      .reply(404, { message: "Not Found" });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("UCSB Dining Commons Menu Items"),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-id`),
    ).not.toBeInTheDocument();

    const errorMessage = console.error.mock.calls[0][0];
    expect(errorMessage).toMatch(
      "Error communicating with backend via GET on /api/ucsbdiningcommonsmenuitem/all",
    );

    restoreConsole();
  });

  test("what happens when you click delete, admin", async () => {
    const queryClient = new QueryClient();
    setupAdminUser();

    axiosMock
      .onGet("/api/ucsbdiningcommonsmenuitem/all")
      .reply(200, ucsbDiningCommonsMenuItemFixtures.threeItems);

    axiosMock.onDelete("/api/ucsbdiningcommonsmenuitem").reply((config) => {
      // Ensure the correct ID is being deleted
      expect(config.params).toEqual({ id: 2 });
      return [200, { message: "UCSBDiningCommonsMenuItem with id 2 deleted" }];
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Wait for the table to be populated
    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`),
      ).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    const mockToast = jest.spyOn(toast, "success").mockImplementation();

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        "UCSBDiningCommonsMenuItem with id 2 deleted",
      );
    });

    expect(axiosMock.history.delete.length).toBe(1);
    expect(axiosMock.history.delete[0].params).toEqual({ id: 2 });

    mockToast.mockRestore();
  });

  test("Does not render Create Button for regular user", async () => {
    const queryClient = new QueryClient();
    setupUserOnly();
    axiosMock.onGet("/api/ucsbdiningcommonsmenuitem/all").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("UCSB Dining Commons Menu Items"),
      ).toBeInTheDocument();
    });

    const createButton = screen.queryByText(
      /Create UCSB Dining Commons Menu Item/,
    );
    expect(createButton).not.toBeInTheDocument();
  });
});
