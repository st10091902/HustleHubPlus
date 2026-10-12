import {
  describe,
  expect,
  it
} from "vitest";

import {
  render,
  screen
} from "@testing-library/react";

import {
  MemoryRouter
} from "react-router-dom";

import GigCard from "../components/GigCard";

describe(
  "GigCard",
  () => {
    it(
      "renders marketplace Gig information",
      () => {
        const gig = {
          _id:
            "507f1f77bcf86cd799439011",

          title:
            "Professional Logo Design",

          description:
            "I will create a professional logo for your business.",

          category:
            "Graphic Design",

          price: 850,

          deliveryDays: 5,

          isActive: true,

          freelancer: {
            name:
              "Alice Freelancer"
          }
        };

        render(
          <MemoryRouter>
            <GigCard
              gig={gig}
            />
          </MemoryRouter>
        );

        expect(
          screen.getByText(
            "Professional Logo Design"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Graphic Design"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Alice Freelancer"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "link",
            {
              name:
                "View Gig"
            }
          )
        ).toHaveAttribute(
          "href",
          "/marketplace/507f1f77bcf86cd799439011"
        );
      }
    );
  }
);