import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from "vitest";

import {
  render,
  screen
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  MemoryRouter
} from "react-router-dom";

import MarketplacePage from "../pages/MarketplacePage";

import {
  getAvailableGigs
} from "../api/gigService";

vi.mock(
  "../api/gigService",
  () => ({
    getAvailableGigs:
      vi.fn(),

    getGigById:
      vi.fn()
  })
);

const testGigs = [
  {
    _id:
      "507f1f77bcf86cd799439011",

    title:
      "Professional Logo Design",

    description:
      "Professional branding and logo design service.",

    category:
      "Graphic Design",

    price: 850,

    deliveryDays: 5,

    isActive: true,

    freelancer: {
      name: "Alice"
    }
  },

  {
    _id:
      "507f1f77bcf86cd799439012",

    title:
      "Responsive Business Website",

    description:
      "Modern responsive website development for businesses.",

    category:
      "Web Development",

    price: 2500,

    deliveryDays: 10,

    isActive: true,

    freelancer: {
      name: "Bob"
    }
  }
];

describe(
  "MarketplacePage",
  () => {
    beforeEach(
      () => {
        getAvailableGigs
          .mockResolvedValue({
            success: true,
            count:
              testGigs.length,
            gigs:
              testGigs
          });
      }
    );

    it(
      "renders Gigs returned by the API",
      async () => {
        render(
          <MemoryRouter>
            <MarketplacePage />
          </MemoryRouter>
        );

        expect(
          await screen.findByText(
            "Professional Logo Design"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Responsive Business Website"
          )
        ).toBeInTheDocument();

        expect(
          getAvailableGigs
        ).toHaveBeenCalledTimes(
          1
        );
      }
    );

    it(
      "filters Gigs using marketplace search",
      async () => {
        const user =
          userEvent.setup();

        render(
          <MemoryRouter>
            <MarketplacePage />
          </MemoryRouter>
        );

        await screen.findByText(
          "Professional Logo Design"
        );

        const searchBox =
          screen.getByRole(
            "searchbox"
          );

        await user.type(
          searchBox,
          "website"
        );

        expect(
          screen.getByText(
            "Responsive Business Website"
          )
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "Professional Logo Design"
          )
        ).not
          .toBeInTheDocument();
      }
    );
  }
);