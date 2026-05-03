"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DEFAULT_PAYMENT_METHOD } from "@/lib/constants";
import { createPaymentMethodSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PAYMENT_METHODS } from "@/lib/constants";
import { paymentMethod } from "@/types";
import z from "zod";
import { updateUserPaymentMethod } from "@/lib/actions/users.actions";
import { toast } from "sonner";

const PaymentMethodForm = ({
  preferredPaymentMethod,
  locale,
}: {
  preferredPaymentMethod: string | null;
  locale: string;
}) => {
  const router = useRouter();
  const paymentMethodSchema = createPaymentMethodSchema(locale);
  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: paymentMethod) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values, locale);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      router.push(`/${locale}/place-order`);
    });
  };
  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="h2-bold mt-4">
        {locale === "en" ? "Payment Method" : "طريقة الدفع"}
      </h1>
      <p className="text-sm text-muted-foreground">
        {locale === "en"
          ? "Please select payment method"
          : "يرجى اختيار طريقة الدفع"}
      </p>
      <form
        method="POST"
        className="space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col md:flex-row">
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet>
                <RadioGroup
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {PAYMENT_METHODS.map((plan) => (
                    <FieldLabel
                      key={plan}
                      htmlFor={`form-rhf-radiogroup-${plan}`}
                    >
                      <Field
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldContent>
                          <FieldTitle>{plan}</FieldTitle>
                        </FieldContent>
                        <RadioGroupItem
                          value={plan}
                          id={`form-rhf-radiogroup-${plan}`}
                          aria-invalid={fieldState.invalid}
                        />
                      </Field>
                    </FieldLabel>
                  ))}
                </RadioGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldSet>
            )}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader className="w-4 h-4 animate-spin"></Loader>
            ) : (
              <ChevronRight
                className={locale === "en" ? `w-4 h-4` : "w-4 h-4 rotate-180"}
              ></ChevronRight>
            )}
            {locale === "en" ? "Continue" : "متابعة"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentMethodForm;
