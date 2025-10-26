import { Sprout } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-white backdrop-blur border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-600 rounded-lg p-2">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-serif font-bold text-gray-900">Smart Crop Advisory</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Empowering farmers with AI-driven crop recommendations and smart agricultural insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/dashboard" className="hover:text-green-600">Dashboard</Link></li>
              <li><Link to="/feedback" className="hover:text-green-600">Feedback</Link></li>
              <li><Link to="/crop-recommendations" className="hover:text-green-600">Crop Recommendations</Link></li>
              <li><Link to="/special-crop-guides" className="hover:text-green-600">Crop Guides</Link></li>
              <li><Link to="/weather-forecast" className="hover:text-green-600">Weather Forecast</Link></li>
              <li><Link to="/market-prices" className="hover:text-green-600">Market Prices</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Training Videos</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Contact</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>📞 1800-CROP-HELP</p>
              <p>📧 support@smartcrop.in</p>
              <p>🌐 www.smartcrop.in</p>
              <p>📍 Agricultural Innovation Hub, India</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">© 2025 Smart Crop Advisory. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-sm text-gray-600">
            <a href="#" className="hover:text-green-600">Privacy Policy</a>
            <a href="#" className="hover:text-green-600">Terms of Service</a>
            <a href="#" className="hover:text-green-600">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
