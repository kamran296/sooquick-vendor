import {
  FaBullseye,
  FaUsers,
  FaHandshake,
  FaUserTie,
  FaClipboardList,
  FaShieldAlt,
  FaExclamationTriangle,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function CompanyPolicy() {
  const navigate = useNavigate();
  const icons = {
    mission: <FaBullseye className="h-6 w-6 text-[#0b8263]" />,
    customer: <FaUsers className="h-6 w-6 text-[#0b8263]" />,
    vendor: <FaHandshake className="h-6 w-6 text-[#0b8263]" />,
    employee: <FaUserTie className="h-6 w-6 text-[#0b8263]" />,
    rules: <FaClipboardList className="h-6 w-6 text-[#0b8263]" />,
    safety: <FaShieldAlt className="h-6 w-6 text-[#0b8263]" />,
    liability: <FaExclamationTriangle className="h-6 w-6 text-[#0b8263]" />,
  };

  return (
    <div className="font-mont min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Enhanced Header */}
      <div className="relative border-b border-gray-100 bg-white shadow-sm">
        <div className="absolute inset-0 top-3 left-5 lg:top-5">
          {" "}
          <div
            className="flex w-fit items-center gap-1 hover:cursor-pointer hover:text-[#0b8263]"
            onClick={() => navigate("/")}
          >
            <FaArrowLeft /> <p>back to home</p>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 py-8 lg:py-6">
          <div className="text-center">
            <h1 className="bg-gradient-to-r from-gray-900 to-[#0b8263] bg-clip-text text-3xl font-bold text-gray-900 text-transparent lg:text-5xl">
              Our Commitment Framework
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-xl leading-relaxed text-gray-600">
              Building trust through transparent policies that empower
              customers, vendors, and employees in a collaborative ecosystem
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Mission Section */}
        <section className="mb-20">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-xl bg-green-50 p-3">{icons.mission}</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Our Vision & Mission
                </h2>
                <p className="mt-2 text-lg text-gray-600">
                  Pioneering a new standard in service excellence
                </p>
              </div>
            </div>
            <p className="rounded-xl border-l-4 border-[#0b8263] bg-gray-50 p-6 text-lg leading-relaxed text-gray-700">
              At SooQuick, our mission is to build a{" "}
              <span className="font-semibold text-gray-900">
                transparent, trustworthy, and efficient
              </span>{" "}
              service ecosystem that benefits customers, vendors, and employees
              equally. We aim to create a sustainable environment where everyone
              can grow, earn, and receive value with reliability, fairness, and
              respect.
              <br />
              Our mission is to foster sustainable growth where every
              stakeholder—customers, vendors, and employees—thrives through
              reliability, fairness, and unwavering respect.
            </p>
          </div>
        </section>

        {/* Customer Commitment */}
        <section className="mb-20">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
            <div className="mb-8 flex items-center gap-4">
              <div className="rounded-xl bg-green-50 p-3">{icons.customer}</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Our Commitment to Customers
                </h2>
                <p className="mt-2 text-lg text-gray-600">
                  We promise to deliver a smooth, safe, and high-quality service
                  experience through:
                </p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div className="rounded-xl border-l-4 border-[#0b8263] bg-gray-50 p-6">
                  <h3 className="mb-3 text-lg font-bold text-gray-900">
                    Trust & Safety
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-[#0b8263]">•</span>
                      <span>
                        Verified and background-checked service providers
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-[#0b8263]">•</span>
                      <span>
                        Strict quality control and performance monitoring
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-[#0b8263]">•</span>
                      <span>Secure and safe service delivery practices</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border-l-4 border-[#0b8263] bg-gray-50 p-6">
                  <h3 className="mb-3 text-lg font-bold text-gray-900">
                    Transparent Experience
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-[#0b8263]">•</span>
                      <span>Transparent pricing with no hidden charges</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-[#0b8263]">•</span>
                      <span>
                        Clear service descriptions, timelines, and expectations
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-[#0b8263]">•</span>
                      <span>Easy-to-use booking and communication system</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl border-l-4 border-[#0b8263] bg-gray-50 p-6">
                  <h3 className="mb-3 text-lg font-bold text-gray-900">
                    Support & Reliability
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-[#0b8263]">•</span>
                      <span>24/7 dedicated customer support team</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-[#0b8263]">•</span>
                      <span>Secure payment processing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-[#0b8263]">•</span>
                      <span>
                        Fair refund, dispute-resolution, and cancellation policy
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-[#0b8263]">•</span>
                      <span>
                        Protection through “SooQuick Guarantee” (optional future
                        feature)
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border-2 border-[#0b8263] bg-green-50 p-6">
                  <h3 className="mb-3 text-lg font-bold text-gray-900">
                    Our Promise
                  </h3>
                  <p className="text-gray-700">
                    We commit to resolving any service issues within 24 hours
                    and ensuring 100% satisfaction through our fair refund and
                    dispute resolution policies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vendor Commitment */}
        <section className="mb-20">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
            <div className="mb-8 flex items-center gap-4">
              <div className="rounded-xl bg-green-50 p-3">{icons.vendor}</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Our Commitment to Vendors
                </h2>
                <p className="mt-2 text-lg text-gray-600">
                  We aim to empower vendors to grow their business with
                  fairness, respect, and consistent earning opportunities.
                </p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div className="rounded-xl bg-gray-50 p-6">
                  <h3 className="mb-3 text-lg font-bold text-gray-900">
                    Business Empowerment
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-[#0b8263]">•</span>
                      <span>Consistent customer bookings</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-[#0b8263]">•</span>
                      <span>
                        Payment collection, payment settlement, and dispute
                        handling
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-[#0b8263]">•</span>
                      <span>Transparent earnings without hidden fees</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl bg-gray-50 p-6">
                  <h3 className="mb-3 text-lg font-bold text-gray-900">
                    Fair Compensation
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-[#0b8263]">•</span>
                      <span>24–36 hour payout for completed services</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-[#0b8263]">•</span>
                      <span>Fair commissions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-[#0b8263]">•</span>
                      <span>
                        Subscription-based commission reduction (optional)
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl bg-gray-50 p-6">
                  <h3 className="mb-3 text-lg font-bold text-gray-900">
                    Growth & Training
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-[#0b8263]">•</span>
                      <span>
                        Initial onboarding and customer-handling training
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-[#0b8263]">•</span>
                      <span>
                        Training for workflow, SOPs, and service standards
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-[#0b8263]">•</span>
                      <span>
                        Access to affordable tools, equipment, and materials
                        (via Tradexity in future)
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border-2 border-[#0b8263] bg-green-50 p-6">
                  <h3 className="mb-3 text-lg font-bold text-gray-900">
                    Vendor Rights
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-[#0b8263]">•</span>
                      <span>Freedom to set service pricing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-[#0b8263]">•</span>
                      <span>Freedom to choose working hours</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-[#0b8263]">•</span>
                      <span>Zero exploitation policy — no forced jobs</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Employee Commitment */}
        <section className="mb-20">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
            <div className="mb-8 flex items-center gap-4">
              <div className="rounded-xl bg-green-50 p-3">{icons.employee}</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Our Commitment to Employees
                </h2>
                <p className="mt-2 text-lg text-gray-600">
                  We prioritise building a healthy, productive, and
                  growth-oriented workplace.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-6 text-center">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Professional Growth
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>Structured training programs</li>
                  <li>Clear career progression opportunities</li>
                  <li>Skill development sessions</li>
                </ul>
              </div>

              <div className="rounded-xl bg-gray-50 p-6 text-center">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Employee-Friendly Environment
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>Positive, safe, and respectful work culture</li>
                  <li>Industry-standard salary packages</li>
                  <li>Health & financial benefits (as applicable)</li>
                  <li>Focus on productivity, not excessive working hours</li>
                </ul>
              </div>

              <div className="rounded-xl bg-gray-50 p-6 text-center">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Ethical Expectations
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    Zero tolerance for harassment, discrimination, or misconduct
                  </li>
                  <li>Fair and transparent performance evaluation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Rules */}
        <section className="mb-20">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
            <div className="mb-8 flex items-center gap-4">
              <div className="rounded-xl bg-green-50 p-3">{icons.rules}</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Platform Rules (For Customers & Vendors)
                </h2>
                <p className="mt-2 text-lg text-gray-600">
                  To keep SooQuick safe and fair, the following rules apply:
                </p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  Community Guidelines
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-900">
                      Customer Rules
                    </h4>
                    <p className="mt-1 text-sm text-gray-700">
                      Provide accurate information when booking, respect service
                      providers and time, avoid fraudulent cancellations or fake
                      complaints and No abusive behaviour or exploitation.
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-900">
                      Vendor Rules
                    </h4>
                    <p className="mt-1 text-sm text-gray-700">
                      Must follow service SOPs and quality guidelines , follow
                      pricing rules (where applicable), no substance use,
                      misconduct, or fraud, Maintain professionalism and hygiene
                      and use verified identity; no impersonation
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <h3 className="mb-3 text-lg font-bold text-red-900">
                  Account Suspension
                </h3>
                <p className="text-sm text-red-800">
                  We reserve the right to suspend or permanently block
                  Fraudulent or abusive users, vendors who repeatedly receive
                  complaints or violate standards and anyone misusing the
                  platform
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Safety, Privacy & Compliance */}
        <section className="mb-20">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
            <div className="mb-8 flex items-center gap-4">
              <div className="rounded-xl bg-green-50 p-3">{icons.safety}</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Safety, Privacy & Compliance Policies
                </h2>
                {/* <p className="mt-2 text-lg text-gray-600">
                  Enterprise-grade protection and regulatory adherence
                </p> */}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-blue-50 p-6">
                <h3 className="mb-3 text-lg font-bold text-gray-900">
                  Safety Protocols
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Vendors must follow safety practices during service</li>
                  <li>• Customers must provide safe working conditions</li>
                  <li>
                    • In emergencies, both parties should report immediately
                  </li>
                </ul>
              </div>

              <div className="rounded-xl bg-purple-50 p-6">
                <h3 className="mb-3 text-lg font-bold text-gray-900">
                  Data Privacy
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Customer data is secured and never sold</li>
                  <li>
                    • Vendors' personal information is only used for
                    verification
                  </li>
                  <li>
                    • All communication should remain within SooQuick’s platform
                  </li>
                </ul>
              </div>

              <div className="rounded-xl bg-orange-50 p-6">
                <h3 className="mb-3 text-lg font-bold text-gray-900">
                  Legal Compliance
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    • SooQuick follows local labour, taxation, and consumer
                    protection laws
                  </li>
                  <li>• Vendors are independent contractors, not employees</li>
                  <li>
                    • Any illegal activity will result in immediate suspension
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Liability Clause */}
        <section className="mb-16">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-xl bg-green-50 p-3">
                {icons.liability}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Liability Clause
                </h2>
              </div>
            </div>

            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
              <p className="leading-relaxed text-gray-700">
                SooQuick is a{" "}
                <span className="font-bold">technology platform</span> that:
                <ul className="ml-5">
                  <li>• Connects customers with independent professionals</li>
                  <li>
                    • Facilitates bookings, payments, and dispute resolution
                  </li>
                </ul>
              </p>
              <p className="my-2 leading-relaxed text-gray-700">
                <span className="font-bold">
                  {" "}
                  Vendors are independent service providers,{" "}
                </span>{" "}
                responsible for:
                <ul className="ml-5">
                  <li>• Quality of work</li>
                  <li>• Tools, safety, and professionalism</li>
                </ul>
              </p>
              <p>
                SooQuick will assist in dispute resolution but is{" "}
                <span className="font-bold">not directly liable</span> for
                vendor actions unless proven negligence from the platform.
              </p>
            </div>
          </div>
        </section>

        {/*  Footer */}
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
              href="mailto:info@sooquick.com"
              className="text-[#0b8263] hover:underline"
            >
              info@sooquick.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
