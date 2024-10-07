const internationalSizes = [
  { size: "XS", us: "0-2", uk: "4-6", eu: "34-36" },
  { size: "S", us: "4-6", uk: "8-10", eu: "36-38" },
  { size: "M", us: "8-10", uk: "12-14", eu: "40-42" },
  { size: "L", us: "12-14", uk: "16-18", eu: "44-46" },
];

const measurementReference = [
  { size: "Suggested", bust: "32-34", waist: "25-27", hips: "34-37" },
  { size: "Sizes", bust: "34-36", waist: "27-29", hips: "37-39" },
  { size: "", bust: "36-38", waist: "29-32", hips: "39-41" },
  { size: "", bust: "38-41", waist: "32-34", hips: "41-44" },
];

export default function SizeGuide() {
  return (
    <div className="max-w-4xl mx-auto p-4 mt-32">
      <h1 className="text-3xl font-bold text-center mb-8 ">Size Guide</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">International Sizes</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Size</th>
                <th className="border p-2 text-left">US</th>
                <th className="border p-2 text-left">UK</th>
                <th className="border p-2 text-left">EU</th>
              </tr>
            </thead>
            <tbody>
              {internationalSizes.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border p-2">{row.size}</td>
                  <td className="border p-2">{row.us}</td>
                  <td className="border p-2">{row.uk}</td>
                  <td className="border p-2">{row.eu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Measurement Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Size</th>
                <th className="border p-2 text-left">Bust</th>
                <th className="border p-2 text-left">Waist</th>
                <th className="border p-2 text-left">Hips</th>
              </tr>
            </thead>
            <tbody>
              {measurementReference.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border p-2">{row.size}</td>
                  <td className="border p-2">{row.bust}</td>
                  <td className="border p-2">{row.waist}</td>
                  <td className="border p-2">{row.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">How to Measure</h2>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-full md:w-1/2">
            <img
              src="/placeholder.svg"
              alt="Size guide diagram"
              width={400}
              height={600}
              className="mx-auto"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="text-xl font-semibold mb-2">A - Bust</h3>
            <p className="mb-4">
              Ensuring your swimwear fits perfectly is essential for both
              comfort and confidence. Measure your chest around the fullest part
              of your bust while wearing a well-fitting bra.
            </p>
            <h3 className="text-xl font-semibold mb-2">B - Waist</h3>
            <p className="mb-4">
              Measure your waistline at the narrowest part of your torso,
              typically just above your belly button.
            </p>
            <h3 className="text-xl font-semibold mb-2">C - Hips</h3>
            <p className="mb-4">
              Measure around the fullest part of your hips and buttocks, keeping
              the tape measure parallel to the floor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
