import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-1 mb-3">
              <span className="text-yellow-500 font-extrabold text-xl">
                Get
              </span>
              <span className="text-gray-900 font-extrabold text-xl">
                Hired
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Empowering KIET students with placement insights, career
              resources, and company data.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold text-sm mb-4">
              Navigate
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: "/", label: "Home" },
                { to: "/dashboard", label: "Dashboard" },
                { to: "/blogs", label: "Blogs" },
                { to: "/recruiters", label: "Recruiters" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-gray-500 hover:text-yellow-600 transition"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-gray-900 font-semibold text-sm mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5">
              {[
                "Placement Cell",
                "Training & Development",
                "Industry Connect",
                "Alumni Network",
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-500">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-semibold text-sm mb-4">
              Contact
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li>
                <span className="font-medium text-gray-700">Email</span>
                <br />
                placements@kiet.edu
              </li>
              <li>
                <span className="font-medium text-gray-700">Phone</span>
                <br />
                +91 1800-XXX-XXXX
              </li>
              <li>
                <span className="font-medium text-gray-700">Location</span>
                <br />
                KIET Deemed to be University
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © 2026 KIET Deemed to be University. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>Built for</span>
            <span className="text-yellow-500 font-semibold">
              KIET Placements
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
