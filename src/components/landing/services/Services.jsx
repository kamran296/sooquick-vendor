import { TbBasketPlus } from "react-icons/tb";
import { CiFilter } from "react-icons/ci";
import { useState } from "react";

const services = [
  {
    id: 1,
    title: "Plumbing Service",
    description: "Expert plumbing solutions for homes and offices.",
    img: "https://via.placeholder.com/120x120",
    location: "Delhi",
    price: "₹1200",
    availability: "Available 24/7",
    rating: "4.7/5",
    discount: "15%",
  },
  {
    id: 2,
    title: "AC Repair",
    description: "Fast and reliable air conditioner repair services.",
    img: "https://via.placeholder.com/120x120",
    location: "Mumbai",
    price: "₹2500",
    availability: "Mon-Sat",
    rating: "4.3/5",
    discount: "5%",
  },
  {
    id: 3,
    title: "House Cleaning",
    description: "Professional cleaning service for your home.",
    img: "https://via.placeholder.com/120x120",
    location: "Bangalore",
    price: "₹1800",
    availability: "Available",
    rating: "4.8/5",
    discount: "20% first booking",
  },
  {
    id: 4,
    title: "Electrician",
    description: "Certified electricians for all your wiring needs.",
    img: "https://via.placeholder.com/120x120",
    location: "Hyderabad",
    price: "₹1500",
    availability: "Available",
    rating: "4.6/5",
    discount: "10%",
  },
  {
    id: 5,
    title: "Carpentry",
    description: "Custom furniture and woodwork solutions.",
    img: "https://via.placeholder.com/120x120",
    location: "Chennai",
    price: "₹3000",
    availability: "Mon-Fri",
    rating: "4.4/5",
    discount: "No current offers",
  },
  {
    id: 6,
    title: "Pest Control",
    description: "Effective pest elimination for all types of infestations.",
    img: "https://via.placeholder.com/120x120",
    location: "Kolkata",
    price: "₹2000",
    availability: "Available",
    rating: "4.9/5",
    discount: "25% seasonal discount",
  },
];

const filterOptions = [
  { id: "search", label: "Search" },
  { id: "location", label: "Location" },
  { id: "price", label: "Price Range" },
  { id: "availability", label: "Availability" },
  { id: "rating", label: "Customer Rating" },
  { id: "discount", label: "Discount" },
];

const Services = () => {
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    availability: "",
    minRating: "",
    discount: false,
  });
  const [activeFilter, setActiveFilter] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      location: "",
      minPrice: "",
      maxPrice: "",
      availability: "",
      minRating: "",
      discount: false,
    });
    setActiveFilter(null);
  };

  const filteredServices = services.filter((service) => {
    // Search filter
    if (
      filters.search &&
      !service.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !service.description.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    // Location filter
    if (
      filters.location &&
      !service.location.toLowerCase().includes(filters.location.toLowerCase())
    ) {
      return false;
    }

    // Price filter
    const servicePrice = parseInt(service.price.replace(/[^0-9]/g, ""));
    if (filters.minPrice && servicePrice < parseInt(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && servicePrice > parseInt(filters.maxPrice)) {
      return false;
    }

    // Availability filter
    if (
      filters.availability &&
      !service.availability
        .toLowerCase()
        .includes(filters.availability.toLowerCase())
    ) {
      return false;
    }

    // Rating filter
    const serviceRating = parseFloat(service.rating.split("/")[0]);
    if (filters.minRating && serviceRating < parseFloat(filters.minRating)) {
      return false;
    }

    // Discount filter
    if (filters.discount && service.discount.includes("No current offers")) {
      return false;
    }

    return true;
  });

  const renderFilterInput = () => {
    switch (activeFilter) {
      case "search":
        return (
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search services..."
            className="w-full rounded-lg border p-2"
          />
        );
      case "location":
        return (
          <select
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            className="w-full rounded-lg border p-2"
          >
            <option value="">All Locations</option>
            {[...new Set(services.map((s) => s.location))].map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        );
      case "price":
        return (
          <div className="space-y-2">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Min price"
              className="w-full rounded-lg border p-2"
            />
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Max price"
              className="w-full rounded-lg border p-2"
            />
          </div>
        );
      case "availability":
        return (
          <select
            name="availability"
            value={filters.availability}
            onChange={handleFilterChange}
            className="w-full rounded-lg border p-2"
          >
            <option value="">All Availability</option>
            <option value="Available">Available</option>
            <option value="Mon-Fri">Weekdays</option>
            <option value="24/7">24/7</option>
          </select>
        );
      case "rating":
        return (
          <select
            name="minRating"
            value={filters.minRating}
            onChange={handleFilterChange}
            className="w-full rounded-lg border p-2"
          >
            <option value="">Any Rating</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="4.0">4.0+ Stars</option>
            <option value="3.5">3.5+ Stars</option>
          </select>
        );
      case "discount":
        return (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="discount"
              checked={filters.discount}
              onChange={handleFilterChange}
              className="h-4 w-4"
            />
            <span>Show only discounted services</span>
          </label>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 px-4 py-6 md:px-14">
      {/* Header filters */}
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        {/* First Row: Main Filters */}
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row md:gap-6">
          <button className="rounded-full bg-[#007758] px-4 py-2 font-semibold text-white transition hover:bg-teal-900">
            Services Categories
          </button>
          <button className="rounded-full bg-[#007758] px-4 py-2 font-semibold text-white transition hover:bg-teal-900">
            Essentials Categories
          </button>
          <button className="rounded-full bg-[#007758] px-4 py-2 font-semibold text-white transition hover:bg-teal-900">
            Offer Services
          </button>
        </div>
        {/* Divider */}
        <hr className="my-2 border-t-2 border-black" />
        {/* Filters Row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() =>
                setActiveFilter(activeFilter === option.id ? null : option.id)
              }
              className={`flex items-center justify-between gap-4 rounded-xl border px-3 py-2 font-medium shadow-sm transition ${
                activeFilter === option.id
                  ? "border-teal-700 bg-teal-100 text-teal-700"
                  : "border-teal-700 bg-white text-teal-700 hover:bg-teal-50"
              }`}
            >
              {option.label} <CiFilter />
            </button>
          ))}
        </div>

        {/* Active Filter Input */}
        {activeFilter && (
          <div className="mt-4 rounded-lg bg-white p-4 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Filter by{" "}
                {filterOptions.find((f) => f.id === activeFilter)?.label}
              </h3>
              <button
                onClick={resetFilters}
                className="text-sm text-teal-700 hover:underline"
              >
                Reset All
              </button>
            </div>
            <div className="mt-3">{renderFilterInput()}</div>
          </div>
        )}
      </div>

      {/* Services Cards */}
      <div className="mx-auto mt-10 flex w-full max-w-4xl flex-col gap-6">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div
              key={service.id}
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-md md:flex-row"
            >
              {/* Image */}
              <div className="flex flex-shrink-0 items-center justify-center bg-gray-100 p-6 md:w-1/3">
                <img
                  src={service.img}
                  alt={service.title}
                  className="h-[200px] w-[200px] rounded-xl object-cover"
                />
              </div>
              {/* Content */}
              <div className="flex flex-1 flex-col justify-between gap-2 p-6">
                <h2 className="text-lg font-semibold text-gray-900 md:text-xl">
                  {service.title}
                </h2>
                <p className="text-sm text-gray-700">{service.description}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                  <span>
                    <b>Location:</b> {service.location}
                  </span>
                  <span>
                    <b>Availability:</b> {service.availability}
                  </span>
                  <span>
                    <b>Rating:</b> {service.rating}
                  </span>
                  <span>
                    <b>Discount:</b> {service.discount}
                  </span>
                  <span>
                    <b>Price:</b> {service.price}
                  </span>
                </div>
                <div className="mt-4">
                  <button className="flex items-center justify-between gap-4 rounded-full bg-[#007758] px-5 py-2 font-bold text-white transition hover:bg-teal-800">
                    Add to Cart <TbBasketPlus />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl bg-white p-8 text-center shadow-md">
            <h3 className="text-lg font-semibold">No services found</h3>
            <p className="mt-2 text-gray-600">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 rounded-full bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-800"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
