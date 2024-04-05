"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Tiptap } from "@ui/entities/Tiptap";
import { Button } from "@ui/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/shared/components/ui/form";
import { Input } from "@ui/shared/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const EditorForm = () => {
  const formSchema = z.object({
    title: z
      .string()
      .min(5, { message: "Hey the title is not long enough" })
      .max(100, { message: "Its too long" }),
    description: z
      .string()
      .min(5, { message: "Hey the description is not long enough" })
      .trim(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: { title: "", description: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("values", values);

    fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => console.log("res", data));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Main title for your content" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Tiptap description={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="my-4" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};
