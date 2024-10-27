"use client";

import { useState } from "react";
import Cookies from "js-cookie";

export default function AddContact() {
  const [contactName, setContactName] = useState("");
  const [contactEmailAddress, setContactEmailAddress] = useState("");
  const [contactPhoneNumber, setContactPhoneNumber] = useState("");
  const [contactAddress, setContactAddress] = useState("");

  const handleContactForm = async (e) => {
    e.preventDefault();
    const date = new Date();
    const dateUTC = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );
    const contactObj = {
      contactName,
      contactEmailAddress,
      contactPhoneNumber,
      contactAddress,
      createdDate: new Date(dateUTC).toISOString(),
    };
    const token = Cookies.get("jwtToken");
    //console.log(token);
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactObj),
    };
    const res = await fetch("/api/contacts/create_contact", options);
    const result = await res.json();
    console.log(result);
  };
  return (
    <div className="flex  justify-center  mt-20 ">
      <form onSubmit={handleContactForm} className="w-2/3">
        <div className="shadow sm:overflow-hidden sm:rounded-md ">
          <div className="space-y-6 bg-white px-4 py-6 sm:p-6">
            <div>
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Please Enter Contact Information
              </h3>
            </div>

            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-6">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  First name
                </label>
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  autoComplete="given-name"
                  onChange={(e) => {
                    setContactName(e.target.value);
                  }}
                  className="mt-2 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="col-span-6 sm:col-span-6">
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email-address"
                  type="text"
                  autoComplete="email"
                  onChange={(e) => {
                    setContactEmailAddress(e.target.value);
                  }}
                  className="mt-2 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="col-span-6 sm:col-span-6">
                <label
                  htmlFor="phone-number"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Phone Number
                </label>
                <input
                  id="phone-number"
                  name="phone-number"
                  type="text"
                  onChange={(e) => {
                    setContactPhoneNumber(e.target.value);
                  }}
                  className="mt-2 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="street-address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Street address
                </label>
                <input
                  id="street-address"
                  name="street-address"
                  type="text"
                  autoComplete="street-address"
                  onChange={(e) => {
                    setContactAddress(e.target.value);
                  }}
                  className="mt-2 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
