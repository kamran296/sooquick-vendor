import React from "react";
import {
  FaUserCheck,
  FaMoneyBillWave,
  FaTools,
  FaBalanceScale,
  FaBan,
  FaHandshake,
  FaCheckCircle,
  FaExclamationTriangle,
  FaIdCard,
  FaCreditCard,
  FaReceipt,
  FaStore,
  FaComments,
  FaTshirt,
  FaUserSlash,
  FaArrowLeft,
} from "react-icons/fa";
import { FaShirt } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const VendorPolicy = () => {
  const navigate = useNavigate();
  return (
    <div className="font-mont min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="relative border-b border-gray-100 bg-white shadow-sm">
        <div className="absolute inset-0 top-2 left-5 lg:top-5">
          {" "}
          <div
            className="flex w-fit items-center gap-1 hover:cursor-pointer hover:text-[#0b8263]"
            onClick={() => navigate("/")}
          >
            <FaArrowLeft /> <p>back to home</p>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 py-8 lg:py-6">
          <div className="text-center">
            <h1 className="bg-gradient-to-r from-gray-900 to-[#0b8263] bg-clip-text text-3xl font-bold text-gray-900 text-transparent lg:text-5xl">
              SOOQUICK — VENDOR POLICY
            </h1>
            <p className="mx-auto mt-2 max-w-4xl text-xl leading-relaxed text-gray-600">
              For Service Partners, Technicians, and Professionals
            </p>
            <p className="mx-auto mt-3 max-w-4xl text-lg text-gray-700">
              This Vendor Policy outlines the expectations, standards, rights,
              and responsibilities for all service providers partnering with
              SooQuick. Our goal is to create a trusted, professional, and
              growth-focused ecosystem for vendors.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="space-y-12">
          {/* 1. Vendor Onboarding Requirements */}
          <section className="scroll-mt-24">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
              <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-8">
                <div className="flex items-center gap-6">
                  <div className="rounded-2xl bg-white p-4 shadow-md">
                    <FaUserCheck className="text-3xl text-[#0b8263]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      1. Vendor Onboarding Requirements
                    </h2>
                    <p className="mt-2 text-lg text-gray-600">
                      To join SooQuick, vendors must:
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-start gap-4 rounded-xl bg-gray-50 p-4">
                    <FaCheckCircle className="mt-1 flex-shrink-0 text-lg text-[#0b8263]" />
                    <p className="text-gray-700">Provide valid ID proof</p>
                  </div>
                  <div className="flex items-start gap-4 rounded-xl bg-gray-50 p-4">
                    <FaCheckCircle className="mt-1 flex-shrink-0 text-lg text-[#0b8263]" />
                    <p className="text-gray-700">
                      Provide address verification
                    </p>
                  </div>
                  <div className="flex items-start gap-4 rounded-xl bg-gray-50 p-4">
                    <FaCheckCircle className="mt-1 flex-shrink-0 text-lg text-[#0b8263]" />
                    <p className="text-gray-700">
                      Submit skill proofs (where applicable)
                    </p>
                  </div>
                  <div className="flex items-start gap-4 rounded-xl bg-gray-50 p-4">
                    <FaCheckCircle className="mt-1 flex-shrink-0 text-lg text-[#0b8263]" />
                    <p className="text-gray-700">
                      Complete background verification
                    </p>
                  </div>
                  <div className="flex items-start gap-4 rounded-xl bg-gray-50 p-4 md:col-span-2">
                    <FaCheckCircle className="mt-1 flex-shrink-0 text-lg text-[#0b8263]" />
                    <p className="text-gray-700">
                      Complete training on customer handling & SOP
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Vendor Financial Policy */}
          <section className="scroll-mt-24">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
              <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 p-8">
                <div className="flex items-center gap-6">
                  <div className="rounded-2xl bg-white p-4 shadow-md">
                    <FaMoneyBillWave className="text-3xl text-[#0b8263]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      2. Vendor Financial Policy
                    </h2>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <div className="rounded-xl bg-gray-50 p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <FaReceipt className="text-xl text-[#0b8263]" />
                        <h3 className="text-xl font-bold text-gray-900">
                          Commission Structure
                        </h3>
                      </div>
                      <ul className="ml-4 space-y-3">
                        <li className="flex items-start gap-3">
                          <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b8263]"></div>
                          <p className="text-gray-700">
                            Flat percentage of commission and reduction on the
                            premium plan and best quality of service, ratings
                            and reviews
                          </p>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b8263]"></div>
                          <p className="text-gray-700">
                            Transparent and visible in dashboard
                          </p>
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <FaCreditCard className="text-xl text-[#0b8263]" />
                        <h3 className="text-xl font-bold text-gray-900">
                          Payouts
                        </h3>
                      </div>
                      <ul className="ml-4 space-y-3">
                        <li className="flex items-start gap-3">
                          <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b8263]"></div>
                          <p className="text-gray-700">
                            Processed within 24–36 hours (or selected plan)
                          </p>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b8263]"></div>
                          <p className="text-gray-700">
                            Hold may apply if disputes are ongoing
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-xl bg-gray-50 p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <FaMoneyBillWave className="text-xl text-[#0b8263]" />
                        <h3 className="text-xl font-bold text-gray-900">
                          Deductions
                        </h3>
                      </div>
                      <ul className="ml-4 space-y-3">
                        <li className="flex items-start gap-3">
                          <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b8263]"></div>
                          <p className="text-gray-700">Platform Commission</p>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b8263]"></div>
                          <p className="text-gray-700">
                            Online payment gateway fee (if applicable)
                          </p>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b8263]"></div>
                          <p className="text-gray-700">
                            Subscription charges (if taken)
                          </p>
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <FaStore className="text-xl text-[#0b8263]" />
                        <h3 className="text-xl font-bold text-gray-900">
                          Refunds
                        </h3>
                      </div>
                      <p className="ml-4 text-gray-700">
                        If rework required due to vendor fault, payment may be
                        reduced
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Tools, Materials & Supplies */}
          <section className="scroll-mt-24">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
              <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-violet-50 p-8">
                <div className="flex items-center gap-6">
                  <div className="rounded-2xl bg-white p-4 shadow-md">
                    <FaTools className="text-3xl text-[#0b8263]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      3. Tools, Materials & Supplies
                    </h2>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  <div className="rounded-xl bg-gray-50 p-6">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">
                      Vendors may use:
                    </h3>
                    <ul className="ml-4 space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b8263]"></div>
                        <p className="text-gray-700">Their own tools</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b8263]"></div>
                        <p className="text-gray-700">
                          Vendors may purchase tools and material from SooQuick
                          partners.
                        </p>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-6">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">
                      Expectations:
                    </h3>
                    <ul className="ml-4 space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b8263]"></div>
                        <p className="text-gray-700">
                          Tools must be in working and safe condition
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b8263]"></div>
                        <p className="text-gray-700">
                          No charging customers for items not used
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Dispute Handling */}
          <section className="scroll-mt-24">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
              <div className="border-b border-gray-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-8">
                <div className="flex items-center gap-6">
                  <div className="rounded-2xl bg-white p-4 shadow-md">
                    <FaComments className="text-3xl text-[#0b8263]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      4. Dispute Handling
                    </h2>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-8">
                  <div className="rounded-xl bg-gray-50 p-6">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">
                      If a customer complains:
                    </h3>
                    <ul className="ml-4 space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b8263]"></div>
                        <p className="text-gray-700">
                          Vendor must cooperate with support team
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b8263]"></div>
                        <p className="text-gray-700">
                          Provide photos, videos, or evidence if requested
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b8263]"></div>
                        <p className="text-gray-700">
                          Rework may be required (as per policy)
                        </p>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-6">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">
                      If dispute is caused by:
                    </h3>
                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <h4 className="mb-2 font-semibold text-red-900">
                          Vendor negligence
                        </h4>
                        <p className="text-sm text-red-800">
                          → vendor may compensate
                        </p>
                      </div>
                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <h4 className="mb-2 font-semibold text-blue-900">
                          Customer misunderstanding
                        </h4>
                        <p className="text-sm text-blue-800">
                          → SooQuick resolves
                        </p>
                      </div>
                      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                        <h4 className="mb-2 font-semibold text-green-900">
                          Operational error
                        </h4>
                        <p className="text-sm text-green-800">
                          → SooQuick compensates
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Vendor Dress Code Policy */}
          <section className="scroll-mt-24">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
              <div className="border-b border-gray-200 bg-gradient-to-r from-pink-50 to-rose-50 p-8">
                <div className="flex items-center gap-6">
                  <div className="rounded-2xl bg-white p-4 shadow-md">
                    <FaShirt className="text-3xl text-[#0b8263]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      5. Vendor Dress Code Policy
                    </h2>
                    <p className="mt-2 text-lg text-gray-600">
                      To maintain brand trust:
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-start gap-4 rounded-xl bg-gray-50 p-4">
                    <FaTshirt className="mt-1 flex-shrink-0 text-lg text-[#0b8263]" />
                    <p className="text-gray-700">
                      Wearing SooQuick T-shirt is encouraged
                    </p>
                  </div>
                  <div className="flex items-start gap-4 rounded-xl bg-gray-50 p-4">
                    <FaMoneyBillWave className="mt-1 flex-shrink-0 text-lg text-[#0b8263]" />
                    <p className="text-gray-700">
                      Vendors may pay 0–50% depending on policy
                    </p>
                  </div>
                  <div className="flex items-start gap-4 rounded-xl bg-gray-50 p-4">
                    <FaIdCard className="mt-1 flex-shrink-0 text-lg text-[#0b8263]" />
                    <p className="text-gray-700">
                      ID badge must carry and be visible
                    </p>
                  </div>
                  <div className="flex items-start gap-4 rounded-xl bg-gray-50 p-4">
                    <FaExclamationTriangle className="mt-1 flex-shrink-0 text-lg text-[#0b8263]" />
                    <p className="text-gray-700">
                      Untidy appearance may affect ratings
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Liability Clause */}
          <section className="scroll-mt-24">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
              <div className="border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50 p-8">
                <div className="flex items-center gap-6">
                  <div className="rounded-2xl bg-white p-4 shadow-md">
                    <FaBalanceScale className="text-3xl text-[#0b8263]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      6. Liability Clause
                    </h2>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-8">
                  <p className="text-lg leading-relaxed text-gray-700">
                    SooQuick is a marketplace platform, not an employer.
                  </p>

                  <div className="rounded-xl bg-gray-50 p-6">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">
                      Vendors are independent professionals, responsible for:
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b8263]"></div>
                        <p className="text-gray-700">Their work</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b8263]"></div>
                        <p className="text-gray-700">Their tools</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b8263]"></div>
                        <p className="text-gray-700">Their conduct</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b8263]"></div>
                        <p className="text-gray-700">Safety precautions</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-green-50 p-6">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">
                      SooQuick acts as:
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b8263]"></div>
                        <p className="text-gray-700">Booking facilitator</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b8263]"></div>
                        <p className="text-gray-700">Payment processor</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b8263]"></div>
                        <p className="text-gray-700">Dispute resolver</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b8263]"></div>
                        <p className="text-gray-700">Verification platform</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                    <h3 className="mb-4 text-xl font-bold text-red-900">
                      SooQuick is not responsible for:
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <FaExclamationTriangle className="mt-1 flex-shrink-0 text-red-600" />
                        <p className="text-red-800">
                          Vendor mistakes or negligence
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <FaExclamationTriangle className="mt-1 flex-shrink-0 text-red-600" />
                        <p className="text-red-800">
                          Customer property damage (unless verified)
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <FaExclamationTriangle className="mt-1 flex-shrink-0 text-red-600" />
                        <p className="text-red-800">
                          Injuries due to unsafe work done by vendors
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Prohibited Vendor Activities */}
          <section className="scroll-mt-24">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
              <div className="border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50 p-8">
                <div className="flex items-center gap-6">
                  <div className="rounded-2xl bg-white p-4 shadow-md">
                    <FaBan className="text-3xl text-[#0b8263]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      7. Prohibited Vendor Activities
                    </h2>
                    <p className="mt-2 text-lg text-gray-600">
                      These can lead to immediate suspension or permanent
                      blacklisting:
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                      <FaUserSlash className="mt-1 flex-shrink-0 text-red-600" />
                      <p className="text-red-800">
                        Taking customers off the platform
                      </p>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                      <FaUserSlash className="mt-1 flex-shrink-0 text-red-600" />
                      <p className="text-red-800">
                        Providing personal phone numbers to customers
                      </p>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                      <FaUserSlash className="mt-1 flex-shrink-0 text-red-600" />
                      <p className="text-red-800">
                        Demanding extra payment or tips
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                      <FaUserSlash className="mt-1 flex-shrink-0 text-red-600" />
                      <p className="text-red-800">
                        Slandering SooQuick or customers
                      </p>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                      <FaUserSlash className="mt-1 flex-shrink-0 text-red-600" />
                      <p className="text-red-800">
                        Violence, theft, or harassment
                      </p>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                      <FaUserSlash className="mt-1 flex-shrink-0 text-red-600" />
                      <p className="text-red-800">
                        Fraudulent jobs or fake check-ins
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 8. Acceptance of Policy */}
          <section className="scroll-mt-24">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
              <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 p-8">
                <div className="flex items-center gap-6">
                  <div className="rounded-2xl bg-white p-4 shadow-md">
                    <FaHandshake className="text-3xl text-[#0b8263]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      8. Acceptance of Policy
                    </h2>
                    <p className="mt-2 text-lg text-gray-600">
                      By joining SooQuick as a vendor, you accept:
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-start gap-4 rounded-xl border border-green-200 bg-green-50 p-4">
                    <FaCheckCircle className="mt-1 flex-shrink-0 text-lg text-green-600" />
                    <p className="text-green-800">
                      All rules & responsibilities
                    </p>
                  </div>
                  <div className="flex items-start gap-4 rounded-xl border border-green-200 bg-green-50 p-4">
                    <FaCheckCircle className="mt-1 flex-shrink-0 text-lg text-green-600" />
                    <p className="text-green-800">
                      Quality standards & behaviour expectations
                    </p>
                  </div>
                  <div className="flex items-start gap-4 rounded-xl border border-green-200 bg-green-50 p-4">
                    <FaCheckCircle className="mt-1 flex-shrink-0 text-lg text-green-600" />
                    <p className="text-green-800">
                      Pricing & commission structure
                    </p>
                  </div>
                  <div className="flex items-start gap-4 rounded-xl border border-green-200 bg-green-50 p-4">
                    <FaCheckCircle className="mt-1 flex-shrink-0 text-lg text-green-600" />
                    <p className="text-green-800">
                      Terms, guidelines, and safety obligations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-600">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            • For policy inquiries, contact{" "}
            <a
              href="mailto:legal@sooquick.com"
              className="text-[#0b8263] hover:underline"
            >
              legal@sooquick.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorPolicy;
