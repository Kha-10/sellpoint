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

// Your form schema
export const FormSchema = z
  .object({
    options: z.array(
      OptionSchema.extend({
        answers: z.array(z.union([z.string(), z.number()])),
        prices: z.array(z.number()).optional(),
        quantities: z.array(z.number()).optional(),
      })
    ),
    variantId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    console.log("data",data);
    
    if (data.variantId === "") {
        console.log('mmsp');
        
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Product variant is required",
         path: ["variantId"]
      });
    }
  });

export type FormValues = z.infer<typeof FormSchema>;
