import { z } from "zod";

const FlexibleOptionItemSchema = z.object({
  name: z.string(),
  amount: z.number().optional(),
});

// Matches your Option interface
export const OptionSchema = z.object({
  name: z.string(),
  type: z.enum(["Checkbox", "Selection", "Number", "Text"]),
  required: z.boolean().optional(),
  value: z.string().optional(),
  settings: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      inputType: z.string().optional(),
      enableQuantity: z.boolean().optional(),
      choices: z.array(FlexibleOptionItemSchema).optional(),
    })
    .optional(),
});

const OptionsSchema = z
  .array(
    OptionSchema.extend({
      answers: z.array(z.union([z.string(), z.number()])),
      prices: z.array(z.number()).optional(),
      quantities: z.array(z.number()).optional(),
    })
  )
  .superRefine((options, ctx) => {
    console.log("options",options);
    
    options.forEach((optionData, optionIndex) => {
      const { type, required } = optionData;
      const answers = optionData.answers || [];

      // --- Text ---
      if (type === "Text" && required) {
        const hasValidAnswer =
          answers.length > 0 &&
          typeof answers[0] === "string" &&
          answers[0].trim() !== "";
        if (!hasValidAnswer) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [optionIndex, "answers", 0],
            message: "This field is required",
          });
        }
      }

      // --- Number ---
      if (type === "Number" && required) {
        const hasValidAnswer =
          answers.length > 0 &&
          typeof answers[0] === "number" &&
          !isNaN(answers[0]);
        if (!hasValidAnswer) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [optionIndex, "answers", 0],
            message: "Please enter a valid number",
          });
        }
      }

      // --- Selection ---
      if (type === "Selection" && required) {
        const hasValidAnswer =
          answers.length > 0 && answers[0] !== undefined && answers[0] !== "";
        if (!hasValidAnswer) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [optionIndex, "answers", 0],
            message: "Please select an option",
          });
        }
      }

      // --- Checkbox ---
      if (type === "Checkbox" && required) {
        const selectedCount = answers.length;

        if (selectedCount === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [optionIndex, "answers"],
            message: "Select at least one option",
          });
        }

        // optional: min/max logic if settings exist
        const settings = optionData.settings;
        if (settings?.min && selectedCount < settings.min) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [optionIndex, "answers"],
            message: `Select at least ${settings.min}`,
          });
        }
        if (settings?.max && selectedCount > settings.max) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [optionIndex, "answers"],
            message: `You can select up to ${settings.max}`,
          });
        }
      }
    });
  });

// form schema
export const FormSchema = z
  .object({
    options: OptionsSchema,
    variantId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    console.log("data", data);

    if (data.variantId === "") {
      console.log("mmsp");

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Product variant is required",
        path: ["variantId"],
      });
    }
  });

export type FormValues = z.infer<typeof FormSchema>;
