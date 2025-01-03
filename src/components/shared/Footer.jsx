import { Link } from "react-router-dom";
import { HelpCircle, Shirt, Users, MapPin } from "lucide-react";


export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h2 className="flex items-center text-lg font-semibold mb-4">
              <HelpCircle className="mr-2" size={20} />
              Help & Information
            </h2>
            <ul className="space-y-2">
              <li>
                <Link to="/store-policies" className="hover:underline">
                  Contac Us
                </Link>
              </li>
              <li>
                <Link to="/store-policies" className="hover:underline">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/store-policies" className="hover:underline">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="hover:underline">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="flex items-center text-lg font-semibold mb-4">
              <Shirt className="mr-2" size={20} />
              Collections
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:underline">
                  Reffinato
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Reffinato Couture
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Reffinato Teens
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Reffinato Sports
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Reffinato Children
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Reffinato man
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Reffinato ropa
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Reffinato Accessories
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="flex items-center text-lg font-semibold mb-4">
              <Users className="mr-2" size={20} />
              About Us
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:underline">
                  Company
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Professional Space
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Sustainbility Program
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="flex items-center text-lg font-semibold mb-4">
              <MapPin className="mr-2" size={20} />
              Search You Store
            </h2>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap justify-center space-x-4 mb-4">
            <Link href="#" className="hover:underline">
              Legal notices
            </Link>
            <Link href="#" className="hover:underline">
              Confidentiality Policy
            </Link>
            <Link href="#" className="hover:underline">
              Acceptance of cookies
            </Link>
            <Link href="#" className="hover:underline">
              General Conditions of Sale
            </Link>
            <Link href="#" className="hover:underline">
              Website map
            </Link>
          </div>
          <p className="text-center text-sm">
            © {new Date().getFullYear()} REFFINATO
          </p>
        </div>
      </div>
    </footer>
  );
}
