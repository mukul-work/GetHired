function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-semibold text-lg mb-2">KIET Deemed to be University</h3>
          <p className="text-sm text-gray-400">Empowering students with the best placement opportunities.</p>
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg mb-2">Placement Cell</h3>
          <p className="text-sm text-gray-400">Email: placements@college.edu</p>
          <p className="text-sm text-gray-400">Phone: +91 1111111111</p>
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg mb-2">Quick Links</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li className="hover:text-white cursor-pointer">Dashboard</li>
            <li className="hover:text-white cursor-pointer">Companies</li>
            <li className="hover:text-white cursor-pointer">Blogs</li>
          </ul>
        </div>
      </div>
      <p className="text-center text-gray-500 text-xs mt-8">© 2026 KIET Deemed to be University. All rights reserved.</p>
    </footer>
  );
}

export default Footer;