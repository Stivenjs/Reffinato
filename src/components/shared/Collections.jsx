import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const collectionItems = {
  verano: [
    "Bikinis Tropicales",
    "Trajes Enteros Elegantes",
    "Accesorios de Playa",
  ],
  resort: ["Trajes de Baño Resort", "Túnicas Elegantes", "Sandalias de Playa"],
  clasicos: ["Bikinis Clásicos", "Trajes de Baño Retro", "Sombreros de Playa"],
};

export default function Collections() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-semibold text-teal-800 mb-6">Colecciones</h2>
      <Tabs defaultValue="verano" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-teal-100">
          <TabsTrigger value="verano" className="text-teal-800">
            Verano 2023
          </TabsTrigger>
          <TabsTrigger value="resort" className="text-teal-800">
            Resort
          </TabsTrigger>
          <TabsTrigger value="clasicos" className="text-teal-800">
            Clásicos
          </TabsTrigger>
        </TabsList>
        {Object.entries(collectionItems).map(([key, items]) => (
          <TabsContent key={key} value={key} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {items.map((item, index) => (
                <Card
                  key={index}
                  className="bg-white hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader>
                    <CardTitle className="text-teal-700">{item}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={`/placeholder.svg?height=200&width=200&text=${item}`}
                      alt={item}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                      Ver Colección
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
