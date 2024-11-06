import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("HelpRequestCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  

  test("renders without crashing", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /helprequest", async () => {
    const queryClient = new QueryClient();
    const helpRequest = {
      id: 5,
      requesterEmail: "student1@example.com",
      teamId: "team01",
      tableOrBreakoutRoom: "Table 1",
      requestTime: "2024-10-30T03:58:52.325Z",
      explanation: "Need help with project setup",
      solved: false,
    };

    axiosMock.onPost("/api/helprequests/post").reply(202, helpRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText("Requester Email");
    const teamIdInput = screen.getByLabelText("Team");
    const roomInput = screen.getByLabelText("Table or Breakout Room");
    const requestTimeInput = screen.getByLabelText("Request Time (iso format)");
    const explanationInput = screen.getByLabelText("Explanation");
    const solvedCheckbox = screen.getByLabelText("Solved");

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: "student1@example.com" } });
    fireEvent.change(teamIdInput, { target: { value: "team01" } });
    fireEvent.change(roomInput, { target: { value: "Table 1" } });
    fireEvent.change(requestTimeInput, { target: { value: "2024-10-30T03:58:52.325Z" } });
    fireEvent.change(explanationInput, { target: { value: "Need help with project setup" } });
    fireEvent.click(solvedCheckbox); // Checked = false

    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      requesterEmail: "student1@example.com",
      teamId: "team01",
      tableOrBreakoutRoom: "Table 1",
      requestTime: "2024-10-30T03:58:52.325Z",
      explanation: "Need help with project setup",
      solved: true,
    });

    expect(mockToast).toBeCalledWith(
      "New HelpRequest Created - id: 5 requesterEmail: student1@example.com",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/helprequest" });
  });
});
