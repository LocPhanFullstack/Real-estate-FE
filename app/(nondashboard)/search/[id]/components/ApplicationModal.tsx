import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApplicationFormData, applicationSchema } from "@/lib/schemas";
import { useCreateApplicationMutation, useGetAuthUserQuery } from "@/state/api";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

const ApplicationModal = ({ isOpen, onClose, propertyId }: ApplicationModalProps) => {
  const [createApplication] = useCreateApplicationMutation();
  const { data: authUser } = useGetAuthUserQuery();

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      message: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: ApplicationFormData) => {
    if (!authUser || authUser.userRole !== "tenant") {
      console.error("You must be logged in as a tenant to submit an application");
      return;
    }
    await createApplication({
      ...data,
      applicationDate: new Date().toISOString(),
      propertyId: propertyId,
      tenantCognitoId: authUser.cognitoInfo.userId,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader className="mb-4">
          <DialogTitle>Submit Application for this Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                aria-invalid={!!errors.name}
                {...register("name")}
                placeholder="Enter your full name"
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                aria-invalid={!!errors.email}
                {...register("email")}
                placeholder="Enter your email address"
              />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.phoneNumber}>
              <FieldLabel htmlFor="phoneNumber">Phone number</FieldLabel>
              <Input
                id="phoneNumber"
                aria-invalid={!!errors.phoneNumber}
                {...register("phoneNumber")}
                placeholder="Enter your phone number"
              />
              {errors.phoneNumber && <FieldError>{errors.phoneNumber.message}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.message}>
              <FieldLabel htmlFor="message">Message (Optional)</FieldLabel>
              <Textarea
                id="message"
                aria-invalid={!!errors.message}
                {...register("message")}
                placeholder="Enter any additional information"
              />
              {errors.message && <FieldError>{errors.message.message}</FieldError>}
            </Field>
          </FieldGroup>

          <div className="pt-4 flex justify-between">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary-700 text-white hover:bg-primary-800 cursor-pointer"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
