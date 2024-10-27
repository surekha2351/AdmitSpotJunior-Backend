"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ContactsTable from "../components/ContactsTable";

export default function Dashboard() {
  const [isEmpty, setEmpty] = useState(false);
  const [listOfContacts, setList] = useState([]);

  useEffect(() => {
    const getListOfContacts = async () => {
      const token = Cookies.get("jwtToken");
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const res = await fetch("/api/contacts/list_of_contacts", options);
      const { ok, list_of_contacts } = await res.json();
      if (!ok) {
        setEmpty(false);
      } else {
        setEmpty(true);
        setList(list_of_contacts);
      }
    };
    getListOfContacts();
  }, []);

  return (
    <main>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {!isEmpty ? (
          <div>
            <p>List of Contacts is empty</p>
          </div>
        ) : (
          <ContactsTable contactData={listOfContacts} />
        )}
      </div>
    </main>
  );
}
