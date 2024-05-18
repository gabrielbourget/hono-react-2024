import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Calendar } from "@/src/components/ui/calendar"
import { api } from "@/src/lib/api";
import { createExpenseSchema } from "../../../../src/sharedTypes";

const Expenses = () => {
  const navigate = useNavigate();
  const form = useForm({
    validatorAdapter: zodValidator,
    defaultValues: {
      title: "",
      amount: "0",
      date: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      console.log({ value });
      const res = await api.expenses.$post({ json: value });
      if (!res.ok) throw new Error("Failed to create expense");
      navigate({ to: "/expenses" }); 
    },
  });

  return (
    <form
      className="m-auto max-w-xl flex flex-col gap-y-5 p-5"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <div className="grid w-full items-center gap-1.5">
        <form.Field
          name="title"
          validators={{ onChange: createExpenseSchema.shape.title }}
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Title</Label>
              <Input
                id={field.name}
                type="text"
                placeholder="Title"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {
                field.state.meta.touchedErrors ? (
                  <em>{field.state.meta.touchedErrors}</em>
                ) : null
              }
            </>
          )}
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <form.Field
          name="amount"
          validators={{ onChange: createExpenseSchema.shape.amount }}
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Amount</Label>
              <Input
                id={field.name}
                type="number"
                placeholder="Amount"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {
                field.state.meta.touchedErrors ? (
                  <em>{field.state.meta.touchedErrors}</em>
                ) : null
              }
            </>
          )}
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <form.Field
          name="date"
          validators={{ onChange: createExpenseSchema.shape.date }}
          children={(field) => (
            <>
              <Calendar
                mode="single"
                selected={new Date(field.state.value)}
                onSelect={(date) => field.handleChange((date ?? new Date()).toISOString())}
                className="rounded-md border"
              />
              {
                field.state.meta.touchedErrors ? (
                  <em>{field.state.meta.touchedErrors}</em>
                ) : null
              }
            </>
          )}
        />
      </div>
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button disabled={!canSubmit} type="submit">
            { isSubmitting ? "Submitting..." : "Create Expense" }
          </Button>
        )}
      />
    </form>
  );
};

export const Route = createFileRoute("/_authenticated/create-expense")({
  component: Expenses,
});
