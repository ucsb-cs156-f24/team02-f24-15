const helpRequestFixtures = {
  oneRequest: {
    id: 1,
    requesterEmail: "student1@example.com",
    teamId: "team01",
    tableOrBreakoutRoom: "Table 1",
    requestTime: "2022-01-02T12:00:00",
    explanation: "Need help with project setup",
    solved: false,
  },
  threeRequests: [
    {
      id: 1,
      requesterEmail: "student1@example.com",
      teamId: "team01",
      tableOrBreakoutRoom: "Table 1",
      requestTime: "2022-01-02T12:00:00",
      explanation: "Need help with project setup",
      solved: false,
    },
    {
      id: 2,
      requesterEmail: "student2@example.com",
      teamId: "team02",
      tableOrBreakoutRoom: "Breakout Room A",
      requestTime: "2022-01-02T12:00:00",
      explanation: "Clarification needed for API response",
      solved: true,
    },
    {
      id: 3,
      requesterEmail: "student3@example.com",
      teamId: "team03",
      tableOrBreakoutRoom: "Table 3",
      requestTime: "2022-01-02T12:00:00",
      explanation: "Issue with database connectivity",
      solved: false,
    },
  ],
};

export { helpRequestFixtures };
