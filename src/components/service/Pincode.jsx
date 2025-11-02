import axios from "axios";
import React, { useState, useEffect } from "react";

const PincodeInput = ({ onServiceAreasChange }) => {
  const [selectedServiceAreas, setSelectedServiceAreas] = useState([]);
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [pincodeData, setPincodeData] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [currentPincode, setCurrentPincode] = useState("");
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

      console.log("data received", data);
      if (data[0].Status === "Success" && data[0].PostOffice) {
        // Transform API data to match the expected format
        const transformedData = data[0].PostOffice.map((office) => ({
          pincode: office.Pincode,
          areaName: office.Name,
          district: office.District,
          state: office.State,
        }));

        setPincodeData(transformedData);
        setCurrentPincode(pincode);
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

  const handlePincodeSubmit = (e, pincode) => {
    e.preventDefault();

    if (pincode && pincode.length === 6) {
      fetchPincodeData(pincode);
    } else {
      setError("Please enter a valid 6-digit pincode");
    }
  };

  const handleAreaSelection = (area) => {
    setSelectedAreas((prev) => {
      if (prev.some((a) => a.areaName === area.areaName)) {
        return prev.filter((a) => a.areaName !== area.areaName);
      } else {
        return [...prev, area];
      }
    });
  };

  const handleSelectAll = () => {
    if (pincodeData.length > 0) {
      if (selectedAreas.length === pincodeData.length) {
        // If all are selected, deselect all
        setSelectedAreas([]);
      } else {
        // Select all areas
        setSelectedAreas(pincodeData);
      }
    }
  };

  const addSelectedAreas = () => {
    if (selectedAreas.length > 0) {
      // Create new service areas with all required fields
      const newServiceAreas = selectedAreas.map((area) => ({
        pincode: area.pincode,
        areaName: area.areaName,
        city: area.district, // Using district as city
        state: area.state,
      }));

      // Combine with existing service areas, avoiding duplicates
      const updatedServiceAreas = [
        ...selectedServiceAreas.filter(
          (sa) =>
            !newServiceAreas.some(
              (nsa) =>
                nsa.pincode === sa.pincode && nsa.areaName === sa.areaName,
            ),
        ),
        ...newServiceAreas,
      ];

      setSelectedServiceAreas(updatedServiceAreas);
      if (onServiceAreasChange) onServiceAreasChange(updatedServiceAreas);

      // Reset for next selection
      setSelectedAreas([]);
      setPincodeData([]);
      setCurrentPincode("");
      setError(null);
    }
  };

  const removeServiceArea = (pincodeToRemove, areaNameToRemove) => {
    const updated = selectedServiceAreas.filter(
      (area) =>
        !(
          area.pincode === pincodeToRemove && area.areaName === areaNameToRemove
        ),
    );
    setSelectedServiceAreas(updated);
    if (onServiceAreasChange) onServiceAreasChange(updated);
  };

  const closeModal = () => {
    setIsPincodeModalOpen(false);
    setPincodeData([]);
    setSelectedAreas([]);
    setCurrentPincode("");
    setError(null);
  };

  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Service Areas *
      </label>

      {/* Selected service areas display */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-2">
          {selectedServiceAreas.map((area, index) => (
            <div
              key={`${area.pincode}-${area.areaName}-${index}`}
              className="mb-2"
            >
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                {area.pincode} - {area.areaName}
                <button
                  type="button"
                  onClick={() => removeServiceArea(area.pincode, area.areaName)}
                  className="ml-1.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                >
                  <span className="sr-only">
                    Remove {area.pincode} - {area.areaName}
                  </span>
                  <svg
                    className="h-2 w-2"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 8 8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth="1.5"
                      d="M1 1l6 6m0-6L1 7"
                    />
                  </svg>
                </button>
              </span>
              <div className="mt-1 ml-2 text-xs text-gray-600">
                {area.city}, {area.state}
              </div>
            </div>
          ))}
        </div>

        {selectedServiceAreas.length === 0 && (
          <p className="mt-1 text-sm text-gray-500">
            No service areas selected yet
          </p>
        )}
      </div>

      {/* Button to open pincode selector */}
      <button
        type="button"
        onClick={() => setIsPincodeModalOpen(true)}
        className="inline-flex items-center rounded-md border border-transparent bg-[#0b8263] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none"
      >
        <svg
          className="mr-2 -ml-1 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        Add Service Areas
      </button>

      {/* Pincode selection modal */}
      {isPincodeModalOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-50 h-full w-full overflow-y-auto bg-gray-600/30">
          <div className="relative top-20 mx-auto w-11/12 rounded-md border bg-white p-5 shadow-lg md:w-3/4 lg:w-1/2">
            <div className="mt-3">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Add Service Areas
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-4">
                {/* Pincode input form */}
                <div className="flex items-center">
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Enter 6-digit pincode"
                    maxLength="6"
                    value={currentPincode}
                    onChange={(e) =>
                      setCurrentPincode(
                        e.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                    className="rounded-l-md border border-r-0 border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={(e) => handlePincodeSubmit(e, currentPincode)}
                    className="rounded-r-md bg-[#0b8263] px-4 py-2 text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    Search
                  </button>
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

                {/* Area selection checklist */}
                {pincodeData.length > 0 && !isLoading && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="text-md mb-2 font-medium text-gray-700">
                      Select areas for pincode {currentPincode}:
                    </h4>

                    <p className="mb-3 text-sm text-gray-600">
                      Found {pincodeData.length} area(s) for this pincode
                    </p>

                    {/* Select all checkbox */}
                    {pincodeData.length > 1 && (
                      <div className="mb-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              selectedAreas.length === pincodeData.length
                            }
                            onChange={handleSelectAll}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {selectedAreas.length === pincodeData.length
                              ? "Deselect all"
                              : "Select all areas"}
                          </span>
                        </label>
                      </div>
                    )}

                    {/* Areas checklist */}
                    <div className="max-h-60 overflow-y-auto rounded-md border p-2">
                      {pincodeData.map((area, index) => (
                        <div key={index} className="mb-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedAreas.some(
                                (a) => a.areaName === area.areaName,
                              )}
                              onChange={() => handleAreaSelection(area)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {area.areaName} ({area.district}, {area.state})
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>

                    {/* Add selected areas button */}
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={addSelectedAreas}
                        disabled={selectedAreas.length === 0}
                        className="rounded-md bg-[#0b8263] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
                      >
                        Add {selectedAreas.length} Selected Area
                        {selectedAreas.length !== 1 ? "s" : ""}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md bg-gray-300 px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-400 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PincodeInput;
