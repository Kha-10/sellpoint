import { z } from "zod";
import { Product } from "./api";

export const FormSchema = z.object({
  variantId: z.string(),
  quantity: z.number().min(1),
  options: z.array(
    z.object({
      name: z.string(),
      answers: z.array(z.union([z.string(), z.number()])),
      prices: z.array(z.number()),
      quantities: z.array(z.number()),
    })
  ),
});

export const validateForm = (product: Product) =>
  FormSchema.superRefine((data, ctx) => {
    // Only validate variantId if product has variants
    if (product.variants && product.variants.length > 0) {
      if (
        !data.variantId ||
        !product.variants.some((v) => v._id === data.variantId)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["variantId"],
          message: "Product variant is required",
        });
      }
    }

    data.options.forEach((opt, optionIndex) => {
      const productOpt = product.options?.find((o) => o.name === opt.name);
      if (!productOpt) return;

      // Required rule
      if (productOpt.required && opt.answers.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options", optionIndex, "answers"],
          message: `${productOpt.name} is required`,
        });
      }

      // Min/Max rule
      const min = productOpt.settings?.min;
      const max = productOpt.settings?.max;
      if (min && opt.answers.length < min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options", optionIndex, "answers"],
          message: `Select at least ${min} option(s)`,
        });
      }
      if (max && opt.answers.length > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options", optionIndex, "answers"],
          message: `Select at most ${max} option(s)`,
        });
      }
    });
  });
export type FormValues = z.infer<typeof FormSchema>;
