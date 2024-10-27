"use client";

import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { read, utils, writeFile } from "xlsx";
import Cookies from "js-cookie";

export default function UploadDocument() {
  const [fileTypeError, setFileTypeError] = useState("Please select a file");
  const [file, setFile] = useState(null);
  const [readFile, setReadFile] = useState(null);
  const [isSaved, setSave] = useState(false);

  const handleFile = (e) => {
    let fileTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    let selectedFile = e.target.files[0];
    // console.log(selectedFile);
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setFileTypeError(`${selectedFile.name} is uploaded`);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setFile(e.target.result);
        };
      } else {
        setFileTypeError(
          "Wrong file type, please select a either .xlsx or csv format"
        );
        setFile(null);
      }
    }
  };
  const handleClick = async () => {
    if (file !== null) {
      const workbook = read(file, { type: "buffer" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const batchData = utils.sheet_to_json(worksheet);

      const batchDataWithData = batchData.map((contact) => {
        const date = new Date();
        const dateUTC = Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          date.getUTCHours(),
          date.getUTCMinutes(),
          date.getUTCSeconds()
        );
        return {
          contactName: contact.name,
          contactEmailAddress: contact.email,
          contactPhoneNumber: contact.phone,
          contactAddress: contact.address,
          createdDate: new Date(dateUTC).toISOString(),
        };
      });

      const token = Cookies.get("jwtToken");
      //console.log(token);
      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(batchDataWithData),
      };
      const req = await fetch("/api/contacts/upload", options);
      const data = await req.json();
      console.log(data);
      setReadFile(data);
      setSave(true);
      setFileTypeError("");
    }
  };

  // console.log(readFile);
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="col-span-3 px-10">
        <label className="block text-xl font-semibold  leading-6 text-gray-900 mt-4">
          Upload File
        </label>
        <div className="mt-2 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
          <div className="space-y-1 text-center">
            <ArrowUpOnSquareIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600 justify-center">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFile}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">.csv or .xlsx</p>
            <p className="text-xs text-gray-500">{fileTypeError}</p>
          </div>
        </div>
        <button
          onClick={handleClick}
          className="inline-flex mt-4 justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          upload
        </button>
        {isSaved ? (
          <table className="min-w-full divide-y divide-gray-300">
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
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {readFile.map((contact, index) => {
                //console.log(localDate.toLocaleString());
                return (
                  <tr key={index}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {contact.contactName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {contact.contactEmailAddress}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {contact.contactPhoneNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {contact.contactAddress}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {contact.createdDate}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="bg-gray-300 h-[30vh] text-center mt-3 ">
            <p className="pt-28 text-gray-800">Nothing to show</p>
          </div>
        )}
      </div>
    </div>
  );
}
