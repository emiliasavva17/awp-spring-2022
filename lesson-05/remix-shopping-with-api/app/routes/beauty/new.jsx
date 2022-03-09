import {
  Link,
  redirect,
  json,
  useActionData,
  useTransition,
  Form,
} from "remix";
import Button from "~/components/Button.jsx";
import PageHeader from "~/components/PageHeader";
import Breadcrumb from "~/components/Breadcrumb.jsx";
import db from "~/db/beauty/db.server";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const img = formData.get("img");
  const price = formData.get("price");

  const errors = {};

  if (!title) errors.title = true;
  if (!description) errors.description = true;
  if (!img) errors.img = true;
  if (!price) errors.price = true;

  console.log(errors);
  if (Object.keys(errors).length > 0) {
    const values = Object.fromEntries(formData);
    return json({ errors, values });
  }

  const uuid = new Date().getTime().toString(16);
  // TODO: Make a POST request via fetch to an API route that receives JSON data
  // and creates the product in the db
  const newProduct = {
    id: uuid,
    title,
    description,
    img,
    price,
  };

  const response = fetch(`http://localhost:3000/api/beauty`, {
    method: "POST",
    body: JSON.stringify(newProduct),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return redirect(`/beauty/${uuid}`);
};

export default function NewProduct() {
  const actionData = useActionData();
  const transition = useTransition();
  let isAdding =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "create";

  return (
    <>
      <Breadcrumb links={[{ to: "/beauty", title: "Beauty" }]} />
      <PageHeader title="New product" subtitle="Make it a good one" />
      <div>
        <Form method="post" className="w-64">
          <fieldset disabled={transition.state === "submitting"}>
            <Label htmlFor="title">Title</Label>
            <input
              type="text"
              name="title"
              id="title"
              defaultValue={actionData?.values.title}
              className="border p-1 border-gray-200 w-full"
            />
            {actionData?.errors.title ? (
              <p style={{ color: "red" }}>You're missing the Title</p>
            ) : null}

            <Label htmlFor="description">Description</Label>
            <textarea
              name="description"
              id="description"
              defaultValue={actionData?.values.description}
              className="border p-1 border-gray-200 w-full"
            ></textarea>
            {actionData?.errors.description ? (
              <p style={{ color: "red" }}>You're missing the Description</p>
            ) : null}
            <Label htmlFor="img">Image URL</Label>
            <input
              type="text"
              name="img"
              id="img"
              defaultValue={actionData?.values.img}
              className="border p-1 border-gray-200 w-full"
            />
            {actionData?.errors.img ? (
              <p style={{ color: "red" }}>You're missing the Image</p>
            ) : null}
            <Label htmlFor="price">Price</Label>
            <input
              type="text"
              name="price"
              id="price"
              //  defaultValue={actionData?.values.price}
              className="border p-1 border-gray-200 w-full"
            />
            {actionData?.errors.price ? (
              <p style={{ color: "red" }}>You're missing the Price</p>
            ) : null}
            <div className="mt-3">
              <button
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded my-3 inline-block"
                type="submit"
                name="_action"
                value="create"
                disabled={isAdding}
              >
                {isAdding ? "Adding ..." : "Add"}
              </button>
            </div>
          </fieldset>
        </Form>
      </div>
    </>
  );
}

function Label({ children, ...rest }) {
  return (
    <label className="block font-semibold mt-3 mb-1" {...rest}>
      {children}
    </label>
  );
}
