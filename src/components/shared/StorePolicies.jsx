import { useState } from "react";
import { ChevronRight, CreditCard, Wallet } from "lucide-react";
import { RiPaypalLine } from "react-icons/ri";
const policies = [
  {
    id: "Returns",
    title: "Shipping & Returns",
    content: [
      "Welcome to Reffinato's Shipping Policy! Here, we ensure to provide you with all the details you need about our shipping methods, packaging, and costs.",
      "We are committed to transparent and reliable shipping services to build trust and make sure that our customers stay loyal!",
      "At Reffinato, we prioritize using long-lasting, quick-drying materials for our swimwear, and we extend the same dedication to our shipping. We want you to receive your order in the best condition and in a timely manner.",
      "We aim to make your shopping experience as smooth as possible, right from the moment you place your order to when it arrives at your doorstep.",
      "At Reffinato, we want you to be completely satisfied with your purchase. Our return policy is designed to make it easy for you to return or exchange items if you've changed your mind or are dissatisfied with a product.",
      "We believe that having a straightforward refund or exchange policy is essential to build trust and reassure our customers that they can shop with confidence.",
    ],
  },
  {
    id: "Store Policies",
    title: "Terms & Conditions",
    content: [
      "I'm a Customer Care section. I'm a great place to write a long text about your company and your services, and, most importantly, how to contact your store with queries. Writing a detailed Customer Care policy is a great way to build trust and reassure your customers that they can buy with confidence.",
      "I'm the second paragraph in your Customer Care section. Click here to add your own text and edit me. It's easy. Just click Edit Text or double click me to add details about your policy and make changes to the font. I'm a great place for you to tell a story and let your users know a little more about you",
      "I'm a Privacy & Safety policy section. I'm a great place to inform your customers about how you use, store, and protect their personal information. Add details such as how you use third-party banking to verify payment, the way you collect data or when will you contact users after their purchase was completed successfully. ",
      "Your user's privacy is of the highest importance to your business, so take the time to write an accurate and detailed policy. Use straightforward language to gain their trust and make sure they keep coming back to your site!",
      "I'm a wholesale inquiries section. I'm a great place to inform other retailers about how they can sell your stunning products. Use plain language and give as much information as possible in order to promote your business and take it to the next level!",
      "I'm the second paragraph in your Wholesale Inquiries section. Click here to add your own text and edit me. It's easy. Just click Edit Text or double click me to add details about your policy and make changes to the font. I'm a great place for you to tell a story and let your users know a little more about you.",
    ],
  },
  {
    id: "Payment",
    title: "Payment Methods",
    content:
      "At Reffinato, we offer various payment methods to ensure a convenient shopping experience:",
    methods: [
      {
        name: "Credit/Debit Card",
        icon: <CreditCard className="w-12 h-12 " />,
        description:
          "We accept all major credit and debit cards for secure online transactions.",
      },
      {
        name: "Paypal",
        icon: <RiPaypalLine className="w-12 h-12" />,
        description:
          "For added convenience, we offer PayPal as a fast and secure payment option.",
      },
      {
        name: "Offline Payments",
        icon: <Wallet className="w-12 h-12 ]" />,
        description:
          "In some cases, we may accept offline payment methods. Please contact us for more information.",
      },
    ],
  },
  {
    id: "Faq",
    title: "FAQ",
    content: "Cooming Soon!",
  },
];

export default function StorePolicies() {
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const selectedContent = policies.find((p) => p.id === selectedPolicy);

  return (
    <div className="flex flex-col md:flex-row max-w-4xl mx-auto p-4 gap-8 mt-32">
      <nav className="md:w-1/4">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
          Store Policies
        </h2>
        <ul className="space-y-2">
          {policies.map((policy) => (
            <li key={policy.id}>
              <button
                onClick={() => setSelectedPolicy(policy.id)}
                className={`flex items-center justify-between w-full p-2 text-left rounded hover:bg-gray-100 ${
                  selectedPolicy === policy.id ? "bg-gray-100 font-medium" : ""
                }`}
              >
                {policy.title}
                <ChevronRight className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <main className="md:w-3/4">
        {selectedPolicy ? (
          <div>
            <h1 className="text-2xl font-bold mb-4">{selectedContent.title}</h1>
            {selectedContent.id === "Payment" ? (
              <>
                <p className="mb-4">{selectedContent.content}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {selectedContent.methods.map((method, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center"
                    >
                      {method.icon}
                      <h3 className="mt-2 mb-1 font-semibold">{method.name}</h3>
                      <p className="text-sm text-gray-600">
                        {method.description}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : Array.isArray(selectedContent.content) ? (
              selectedContent.content.map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))
            ) : (
              <p>{selectedContent.content}</p>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-8">
            Select a policy to see more details.
          </div>
        )}
      </main>
    </div>
  );
}
