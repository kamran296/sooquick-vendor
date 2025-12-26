import axios from "axios";
import React, { useState } from "react";

const PincodeInput = ({ onPincodeSelect, currentPincode = "" }) => {
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [pincodeData, setPincodeData] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [inputPincode, setInputPincode] = useState(currentPincode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch pincode data from API
  const fetchPincodeData = async (pincode) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = await response.data;

      if (data[0].Status === "Success" && data[0].PostOffice) {
        // Transform API data to match the expected format
        const transformedData = data[0].PostOffice.map((office) => ({
          pincode: office.Pincode,
          areaName: office.Name,
          district: office.District,
          state: office.State,
          country: "India",
        }));

        setPincodeData(transformedData);

        // If there's only one area, auto-select it
        if (transformedData.length === 1) {
          setSelectedArea(transformedData[0]);
        }
      } else {
        setError("No data found for this pincode");
        setPincodeData([]);
      }
    } catch (err) {
      setError("Failed to fetch pincode data");
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePincodeSubmit = (e) => {
    e.preventDefault();

    if (inputPincode && inputPincode.length === 6) {
      fetchPincodeData(inputPincode);
    } else {
      setError("Please enter a valid 6-digit pincode");
    }
  };

  const handleAreaSelection = (area) => {
    setSelectedArea(area);
  };

  const addSelectedArea = () => {
    if (selectedArea) {
      if (onPincodeSelect) {
        onPincodeSelect(selectedArea);
      }
      closeModal();
    }
  };

  const closeModal = () => {
    setIsPincodeModalOpen(false);
    setPincodeData([]);
    setSelectedArea(null);
    setError(null);
  };

  return (
    <div className="mb-2">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Postal Code
      </label>

      <div className="flex">
        {/* <input
          type="text"
          value={inputPincode}
          onChange={(e) =>
            setInputPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
          placeholder="Enter pincode"
          readOnly
        /> */}
        <button
          type="button"
          onClick={() => setIsPincodeModalOpen(true)}
          className="ml-2 inline-flex items-center rounded-md border border-transparent bg-teal-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none"
        >
          Add Pincode
        </button>
      </div>

      {/* Pincode selection modal */}
      {isPincodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Find Your Area
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enter 6-digit Pincode
                </label>
                <div className="mt-1 flex">
                  <input
                    type="text"
                    value={inputPincode}
                    onChange={(e) =>
                      setInputPincode(
                        e.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    placeholder="e.g., 110001"
                  />
                  <button
                    type="button"
                    onClick={handlePincodeSubmit}
                    className="ml-2 inline-flex items-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none"
                  >
                    Search
                  </button>
                </div>
              </div>

              {isLoading && (
                <div className="my-4 text-center">
                  <p>Loading pincode data...</p>
                </div>
              )}

              {error && (
                <div className="my-4 rounded-md bg-red-50 p-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {/* Area selection */}
              {pincodeData.length > 0 && !isLoading && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="text-md mb-2 font-medium text-gray-700">
                    Select your area:
                  </h4>

                  <div className="max-h-60 overflow-y-auto rounded-md border p-2">
                    {pincodeData.map((area, index) => (
                      <div
                        key={index}
                        className={`mb-2 cursor-pointer rounded-md p-3 ${selectedArea?.areaName === area.areaName ? "border border-teal-200 bg-teal-50" : "hover:bg-gray-50"}`}
                        onClick={() => handleAreaSelection(area)}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            checked={selectedArea?.areaName === area.areaName}
                            onChange={() => handleAreaSelection(area)}
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {area.areaName}
                          </span>
                        </div>
                        <div className="mt-1 ml-6 text-xs text-gray-500">
                          {area.district}, {area.state}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add selected area button */}
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={addSelectedArea}
                      disabled={!selectedArea}
                      className="w-full rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                      Select Area
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PincodeInput;
