import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import { useForm } from '@tanstack/react-form'
import { api } from '@/lib/api'
export const Route = createFileRoute('/create_expense')({
  component: CreateExpense,
})

function CreateExpense() {

  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      title: '',
      amount: 0,
    },
    onSubmit: async ({ value }) => {
      //here we can set if we want a loader from the tanStack query to hit before displaying the data
      await new Promise((r) => setTimeout(r, 1000))
      
      const res = await api.expenses.$post({json: value});
      if(!res.ok) {
        throw new Error("Cannot save expense")
      }
      navigate({to: "/expenses"})
    },
  })

  return (
    <>
    <div className='p-2 max-w-3xl m-auto'>
      <h2>Create an Expense</h2>
        <form onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}>
          <div>
            <form.Field
              name="title"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>Title:</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length ? (
                    <em>{field.state.meta.errors.join(", ")}</em>
                  ) : null}
                </>
              )}
            />
          </div>
          <div>
            <form.Field
              name="amount"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>Amount:</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    type='number'
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length ? (
                    <em>{field.state.meta.errors.join(", ")}</em>
                  ) : null}
                </>
              )}
            />
          </div>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button className='mt-4' type='submit' disabled={!canSubmit}>
                {isSubmitting ? "Submitting" : "Submit Expense"}
              </Button>
            )}
          />
      </form>
    </div>
    </>
  )
}
