import { redirect, Link, useTransition, Form } from "remix";
import { useLoaderData } from "remix";
import PageHeader from "~/components/PageHeader";
import Button from "~/components/Button.jsx";
import Breadcrumb from "~/components/Breadcrumb.jsx";
import db from "~/db/beauty/db.server";
import star from "~/resources/assets/star.svg";
import { useState } from "react";

export const loader = async function({ params }) {
  const product = await fetch(
    `http://localhost:3000/api/beauty/${params.productId}`
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

export const action = async function({ request, params }) {
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    // TODO: Create an API route and send a DELETE request to it
    const response = fetch(
      `http://localhost:3000/api/beauty/${params.productId}`,
      {
        method: "DELETE",
      }
    );
    return redirect("/beauty");
  }
};

export default function Post() {
  const product = useLoaderData();
  let transition = useTransition();
  let isDeleting =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "delete";

  return (
    <div>
      <Breadcrumb links={[{ to: "/beauty", title: "Beauty" }]} />
      <div className="flex">
        <img src={product.img} className="h-96" />
        <div className="ml-5">
          <PageHeader title={product.title} />
          <p>{product.description}</p>
          <div className="flex justify-between">
            <p>{product.price} DKK</p>
            <div className="flex items-center">
              <p>{product.rating}</p>
              <img src={star} className="h-4 ml-1" />
            </div>
          </div>
          <Form method="post" className="mt-5 pt-2 border-t border-gray-200">
            <input type="hidden" name="_method" value="delete" />
            <button
              type="submit"
              className="bg-red-500 text-white font-bold py-2 px-4 rounded my-3 inline-block"
              type="submit"
              name="_action"
              value="delete"
              disabled={isDeleting}
              destructive
            >
              {isDeleting ? "Deleting ..." : "Delete"}
            </button>
          </Form>
          <form method="post" className="mt-5 pt-2 border-t border-gray-200">
            <input type="hidden" name="_method" value="update" />
            <Button type="submit">
              <Link to={`update`}>Update</Link>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
