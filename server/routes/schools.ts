import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

//set columns for Expense
//Object as it exists in the fake db
const schoolSchema = z.object({
    id: z.number().int().positive().min(1), 
    school: z.string().min(3).max(100)
})

//here we infer into TypeScript type from the zod object type validator
type School = z.infer<typeof schoolSchema>

// this way we dont have duplicate validations when creating a new school -- we just check that it follows whats in the db
const createPostSchema = schoolSchema.omit({id: true})

// Define the schema for updating an school (similar to your POST schema)
const updateSchoolSchema = z.object({
    title: z.string().min(3).max(100),   // Ensure title is a string between 3-100 chars
    amount: z.number().positive(),      // Ensure amount is a positive number
  });
// TEMP FAKE DB
// Create a few fake schools
const fakeSchools: { id: number; school: string }[] = [
    { id: 1, school: 'Green Valley High School' },
    { id: 2, school: 'Riverwood Academy' },
    { id: 3, school: 'Silver Oak International School' },
    { id: 4, school: 'Mountain Peak Secondary School' },
    { id: 5, school: 'Blue Ridge School for Excellence' },
];

export const schollsRoute = new Hono()
//get all
.get("/", async (c) => {
    //here we can set if we want a loader from the tanStack query to hit before displaying the data
    await new Promise((r) => setTimeout(r, 1000))
    return c.json({scholls: fakeSchools });
})
//get by id 
/**
 * So here we always parsing string but we need to validate that 
 * we're only getting an integer before running the parse to 
 * integer and getting that school {[0-9]+} check for one or more numbers 
 * ELSE hit the 404 NOT FOUND
 * 
 **/
.get("/:id{[0-9]+}", async (c) => {
    //here we can set if we want a loader from the tanStack query to hit before displaying the data
    await new Promise((r) => setTimeout(r, 1000))
    const id = Number.parseInt(c.req.param("id"))
    const foundSchool = fakeSchools.find(foundSchool => foundSchool.id === id)
    if(!foundSchool){
        return c.notFound()
    }
    return c.json(foundSchool)
})
//post
.post("/", zValidator("json", createPostSchema), async (c) => {
    /** 
     * give any json data posted to this end point - 
     * inferring type Expense is necessary to ensure only Expenses can be created here 
     * that way user can also log specifically within the Expense for compile time checking console.log(school.amount)
     * also setting up ZOD validation for frontend handling before hitting backend for runtime validation
     * then we push the new school into the fake db
     **/
    const data = await c.req.valid("json")
    const newExpense = createPostSchema.parse(data)
    fakeSchools.push({...newExpense, id: fakeSchools.length + 1})
    c.status(201)
    return c.json(newExpense);
})
//delete
.delete("/:id{[0-9]+}", async (c) => {
    const id = Number.parseInt(c.req.param("id"))
    const foundSchool = fakeSchools.findIndex(foundSchool => foundSchool.id === id)
    if(foundSchool === -1){
        return c.notFound()
    }
    const deletedExpense = fakeSchools.splice(foundSchool, 1)[0];
    return c.json({school: deletedExpense})
})
//get Total amount of schools
// .get("/total-spent", async (c) => {
//     //here we can set if we want a loader from the tanStack query to hit before displaying the data
//     await new Promise((r) => setTimeout(r, 1000))
//     const totalSpent = fakeSchools.reduce((acc, school) => acc + school.amount, 0);
//     return c.json({ totalSpent });
// })

// PUT: Update an existing school
.put("/:id{[0-9]+}", zValidator("json", updateSchoolSchema), async (c) => {
    const id = Number.parseInt(c.req.param("id"));  // Get the ID from the URL
    const data = await c.req.valid("json");        // Get the request body
    
    console.log(id); // Debugging to ensure id is parsed correctly
  
    if (isNaN(id) || id <= 0) {
      console.log("Invalid ID provided");  // Handle invalid id
    }
  
    const index = fakeSchools.findIndex((school) => school.id === id); // Find the school by ID
    if (index === -1) {
      return c.notFound();  // If the school is not found, return 404
    }
  
    // Update the school
    const updatedExpense = { ...fakeSchools[index], ...data };
    fakeSchools[index] = updatedExpense;
  
    return c.json(updatedExpense); // Return the updated school
  });
  