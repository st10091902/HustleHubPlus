import {
  describe,
  expect,
  it,
  vi
} from "vitest";

import {
  render,
  screen,
  waitFor
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import GigForm from "../components/GigForm";

describe(
  "GigForm",
  () => {
    it(
      "submits valid Freelancer Gig input",
      async () => {
        const user =
          userEvent.setup();

        const handleSubmit =
          vi
            .fn()
            .mockResolvedValue(
              undefined
            );

        render(
          <GigForm
            onSubmit={
              handleSubmit
            }
            submitting={
              false
            }
            submitLabel="Create Gig"
          />
        );

        await user.type(
          screen.getByLabelText(
            "Gig title"
          ),
          "Professional Website"
        );

        await user.type(
          screen.getByLabelText(
            "Category"
          ),
          "Web Development"
        );

        await user.type(
          screen.getByLabelText(
            "Description"
          ),
          "I will create a professional responsive website for your business."
        );

        await user.type(
          screen.getByLabelText(
            "Price (ZAR)"
          ),
          "2500"
        );

        await user.type(
          screen.getByLabelText(
            "Delivery time"
          ),
          "10"
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Create Gig"
            }
          )
        );

        await waitFor(
          () => {
            expect(
              handleSubmit
            ).toHaveBeenCalledWith(
              {
                title:
                  "Professional Website",

                description:
                  "I will create a professional responsive website for your business.",

                category:
                  "Web Development",

                price: 2500,

                deliveryDays:
                  10,

                isActive:
                  true
              }
            );
          }
        );
      }
    );
  }
);