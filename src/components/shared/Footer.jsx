import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-teal-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Acerca de Reffinato Beach
            </h3>
            <p className="text-sm text-teal-200">
              Diseños elegantes y cómodos para tu estilo de vida playero.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-teal-200 hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-teal-200 hover:text-white">
                  Envíos y Devoluciones
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-teal-200 hover:text-white">
                  Cuidado de Prendas
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <p className="text-sm text-teal-200">
              Email: info@reffinatobeach.com
            </p>
            <p className="text-sm text-teal-200">Teléfono: +1 234 567 890</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Suscríbete</h3>
            <p className="text-sm text-teal-200 mb-2">
              Recibe nuestras últimas ofertas y novedades.
            </p>
            <div className="flex">
              <Input
                type="email"
                placeholder="Tu email"
                className="rounded-r-none bg-teal-700 text-white placeholder-teal-300 border-teal-600"
              />
              <Button className="rounded-l-none bg-orange-500 text-white hover:bg-orange-600">
                Suscribir
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-teal-700 text-center text-sm text-teal-200">
          <p>&copy; 2023 Reffinato Beach. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
