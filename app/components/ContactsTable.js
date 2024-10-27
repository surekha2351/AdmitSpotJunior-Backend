import Link from "next/link";
import { useState } from "react";
import Cookies from "js-cookie";
import { utils, writeFile } from "xlsx";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";

export default function ContactsTable({ contactData }) {
  const copyListOfContacts = contactData;
  //console.log(copyListOfContacts);
  const [contactList, setContactList] = useState(copyListOfContacts);

  const handleDelete = (e) => {
    const id = e.target.value;
    const modifiedList = contactList.filter(
      (contact) => contact.contact_id !== id
    );
    setContactList(modifiedList);
  };

  const handleDownload = async () => {
    const data = document.getElementById("contact_table");
    const workbook = utils.table_to_book(data);
    workbook.Sheets["Sheet1"];
    writeFile(workbook, "contacts.xlsx");
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table
                className="min-w-full divide-y divide-gray-300"
                id="contact_table"
              >
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Contact Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Contact Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Contact Phone
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Contact Address
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Created On
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <button
                        className="bg-indigo-600 hover:bg-indigo-700 py-2 px-2  text-white  rounded inline-flex items-center text-sm"
                        onClick={handleDownload}
                      >
                        <DocumentArrowDownIcon className="w-5 h-5"/>
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {contactList.map((contact) => {
                    const localDate = new Date(contact.contact_timezone);
                    //console.log(localDate.toLocaleString());
                    return (
                      <tr key={contact.contact_id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {contact.contact_name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {contact.contact_email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {contact.contact_phone}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {contact.contact_address}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {localDate.toLocaleString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link
                            href={`/update_contacts/${contact.contact_id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </Link>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 text-red-600 hover:text-red-400">
                          <button
                            type="button"
                            onClick={handleDelete}
                            value={contact.contact_id}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
