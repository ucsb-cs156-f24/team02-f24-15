const menuItemReviewFixtures = {
  oneReview: {
    id: 1,
    itemId: 20,
    reviewerEmail: "cgaucho@ucsb.edu",
    stars: 3,
    dateReviewed: "2022-01-02T12:00:00",
    comments: "okay",
  },
  threeReviews: [
    {
      id: 2,
      itemId: 24,
      reviewerEmail: "amy@ucsb.edu",
      stars: 4,
      dateReviewed: "2022-01-03T12:00:00",
      comments: "good",
    },
    {
      id: 3,
      itemId: 28,
      reviewerEmail: "chris@ucsb.edu",
      stars: 1,
      dateReviewed: "2022-01-04T12:00:00",
      comments: "terrible",
    },
    {
      id: 4,
      itemId: 32,
      reviewerEmail: "john@ucsb.edu",
      stars: 5,
      dateReviewed: "2022-01-05T12:00:00",
      comments: "amazing",
    },
  ],
};

export { menuItemReviewFixtures };
