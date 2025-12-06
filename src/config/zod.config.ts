import { z } from "zod";

export const loadZod = () => {
  z.config({
    customError: (issue) => {
      if (issue.code === "invalid_type" && issue.input === undefined) {
        if (!issue.path) return "Missing input";
        return `Missing input: ${issue.path.join(".")} is required`;
      }
    },
  });
};
