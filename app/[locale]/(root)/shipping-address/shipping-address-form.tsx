"use client";

import { useRouter } from "next/navigation";
import { ShippingAddress } from "@/types";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import * as z from "zod";
import { createShippingAddressSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader } from "lucide-react";
import { defaultShippingAddress } from "@/lib/constants";
import { updateUserAddress } from "@/lib/actions/users.actions";
import { toast } from "sonner";


const ShippingAddressForm = ({
  address,
  locale,
}: {
  address?: ShippingAddress;
  locale: string;
}) => {
   const router = useRouter();
  const shippingAddressSchema = createShippingAddressSchema(locale);
  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || defaultShippingAddress,
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
    values,
  ) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      router.push(`/${locale}/payment-method`);
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="h2-bold mt-4">
        {locale === "en" ? "Shipping Address" : "عنوان الشحن"}
      </h1>
      <p className="text-sm text-muted-foreground">
        {locale === "en"
          ? "Please enter an address to ship to"
          : "يرجى إدخال عنوان الشحن"}
      </p>
      <form
        method="POST"
        className="space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col md:flex-row">
          <FieldGroup>
            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    {locale === "en" ? "Full Name" : "الاسم الكامل"}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder={locale === "en" ? "Full Name" : "الاسم الكامل"}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="streetAddress"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-description">
                    {locale === "en" ? "Street Address" : "عنوان الشارع"}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder={
                      locale === "en" ? "Street Address" : "عنوان الشارع"
                    }
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="city"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-description">
                    {locale === "en" ? "City Code" : "المدينة"}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder={locale === "en" ? "City Code" : "المدينة"}
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="postalCode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-description">
                    {locale === "en" ? "Postal Code" : "الرمز البريدي"}
                  </FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    aria-required={false}
                    placeholder={
                      locale === "en" ? "Postal Code" : "الرمز البريدي"
                    }
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="country"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-description">
                    {locale === "en" ? "Country" : "الدولة"}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder={locale === "en" ? "Country" : "الدولة"}
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
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

export default ShippingAddressForm;
