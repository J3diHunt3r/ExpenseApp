import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

//set columns for Expense
//Object as it exists in the fake db
const expenseSchema = z.object({
    id: z.number().int().positive().min(1), 
    title: z.string().min(3).max(100),
    amount: z.number().int().positive()
})

//here we infer into TypeScript type from the zod object type validator
type Expense = z.infer<typeof expenseSchema>

// this way we dont have duplicate validations when creating a new expense -- we just check that it follows whats in the db
const createPostSchema = expenseSchema.omit({id: true})

// Define the schema for updating an expense (similar to your POST schema)
const updateExpenseSchema = z.object({
    title: z.string().min(3).max(100),   // Ensure title is a string between 3-100 chars
    amount: z.number().positive(),      // Ensure amount is a positive number
  });
// TEMP FAKE DB
const fakeExpenses: Expense[] = [
    { id: 1, title: "Groceries", amount: 150.75 },
    { id: 2, title: "Electricity Bill", amount: 65.50 },
    { id: 3, title: "Internet Subscription", amount: 45.99 },
    { id: 4, title: "Fuel", amount: 80.00 },
    { id: 5, title: "Dining Out", amount: 120.00 },
    { id: 6, title: "Gym Membership", amount: 30.00 },
    { id: 7, title: "Car Maintenance", amount: 250.30 },
];

export const expensesRoute = new Hono()
//get all
.get("/", async (c) => {
    //here we can set if we want a loader from the tanStack query to hit before displaying the data
    await new Promise((r) => setTimeout(r, 1000))
    return c.json({expenses: fakeExpenses });
})
//get by id 
/**
 * So here we always parsing string but we need to validate that 
 * we're only getting an integer before running the parse to 
 * integer and getting that expense {[0-9]+} check for one or more numbers 
 * ELSE hit the 404 NOT FOUND
 * 
 **/
.get("/:id{[0-9]+}", async (c) => {
    //here we can set if we want a loader from the tanStack query to hit before displaying the data
    await new Promise((r) => setTimeout(r, 1000))
    const id = Number.parseInt(c.req.param("id"))
    const foundExpense = fakeExpenses.find(foundExpense => foundExpense.id === id)
    if(!foundExpense){
        return c.notFound()
    }
    return c.json(foundExpense)
})
//post
.post("/", zValidator("json", createPostSchema), async (c) => {
    /** 
     * give any json data posted to this end point - 
     * inferring type Expense is necessary to ensure only Expenses can be created here 
     * that way user can also log specifically within the Expense for compile time checking console.log(expense.amount)
     * also setting up ZOD validation for frontend handling before hitting backend for runtime validation
     * then we push the new expense into the fake db
     **/
    const data = await c.req.valid("json")
    const newExpense = createPostSchema.parse(data)
    fakeExpenses.push({...newExpense, id: fakeExpenses.length + 1})
    c.status(201)
    return c.json(newExpense);
})
//delete
.delete("/:id{[0-9]+}", async (c) => {
    const id = Number.parseInt(c.req.param("id"))
    const foundExpense = fakeExpenses.findIndex(foundExpense => foundExpense.id === id)
    if(foundExpense === -1){
        return c.notFound()
    }
    const deletedExpense = fakeExpenses.splice(foundExpense, 1)[0];
    return c.json({expense: deletedExpense})
})
//get Total spent on expenses
.get("/total-spent", async (c) => {
    //here we can set if we want a loader from the tanStack query to hit before displaying the data
    await new Promise((r) => setTimeout(r, 1000))
    const totalSpent = fakeExpenses.reduce((acc, expense) => acc + expense.amount, 0);
    return c.json({ totalSpent });
})

// PUT: Update an existing expense
.put("/:id{[0-9]+}", zValidator("json", updateExpenseSchema), async (c) => {
    const id = Number.parseInt(c.req.param("id"));  // Get the ID from the URL
    const data = await c.req.valid("json");        // Get the request body
    
    console.log(id); // Debugging to ensure id is parsed correctly
  
    if (isNaN(id) || id <= 0) {
      console.log("Invalid ID provided");  // Handle invalid id
    }
  
    const index = fakeExpenses.findIndex((expense) => expense.id === id); // Find the expense by ID
    if (index === -1) {
      return c.notFound();  // If the expense is not found, return 404
    }
  
    // Update the expense
    const updatedExpense = { ...fakeExpenses[index], ...data };
    fakeExpenses[index] = updatedExpense;
  
    return c.json(updatedExpense); // Return the updated expense
  });
  