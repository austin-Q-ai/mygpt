import { ScrollableArea } from "@calcom/ui";

const data = {
  title: "Terms and Conditions",
  description:
    'These Terms and Conditions ("Terms") govern the use of the service offered by CKAPITAL SA (hereinafter referred to as "the Service") that enables experts to sell their time using timetokens, create AI clones, and provide related features. By using the Service, you agree to be bound by these Terms. Please read them carefully.',
  items: [
    {
      title: "1. Use of Timetokens",
      description: [
        `1.1. Timetokens: The Service allows experts to sell their time in units called "timetokens," each representing 5 minutes of the expert's availability.`,
        `1.2. Booking Calendar: The experts maintain a booking calendar where users can book their time slots using timetokens.`,
        `1.3. Cancellations: The Service is not responsible for any customer's cancellation of a booked event on the expert's calendar. It is the expert's responsibility to manage their schedule and bookings.`,
      ],
    },
    {
      title: "2. AI Clones and Talking Image Clones",
      description: [
        "2.1. AI Clones: The Service allows experts to create AI clones using their expertise documents and personality tests. These AI clones can interact with users on behalf of the expert.",
        "2.2. Talking Image Clones: The Service also provides the option to create talking image clones with the voice of the expert. However, we do not guarantee that the cloned voice will be identical to the expert's real voice.",
        "2.3. Disclaimer: The Service is not responsible for any damage that an AI clone may cause by providing inaccurate or inappropriate information in response to user requests. Experts are solely responsible for the behavior and responses of their AI clones.",
      ],
    },
    {
      title: "3. Expertise Presentation Page and Microcoard",
      description: [
        "3.1. Expertise Presentation Page: The Service offers experts the option to create a detailed expertise presentation page that includes information about the expert's background, qualifications, and availability.",
        "3.2. Microcoard: The Service provides a 3D cube representation of the expert's social networks, title, and available calendar meetings with timetokens.",
      ],
    },
    {
      title: "4. User Responsibilities",
      description: [
        "4.1. Accuracy of Information: Experts are responsible for ensuring the accuracy and appropriateness of the information provided in their expertise presentation page, AI clones, and related content.",

        "4.2. Compliance with Laws: Users and experts must comply with all applicable laws and regulations when using the Service.",
      ],
    },
    {
      title: "5. Limitation of Liability",
      description: [
        '5.1. The Service is provided "as is," and we make no representations or warranties of any kind, either expressed or implied.',

        "5.2. The Service is not responsible for any direct, indirect, incidental, special, or consequential damages resulting from the use of the Service or the actions of AI clones.",
      ],
    },
    {
      title: "6. Termination",
      description: [
        "6.1. We reserve the right to terminate or suspend the Service, your account, or any associated AI clones, at our sole discretion, without prior notice.",
      ],
    },
    {
      title: "7. Changes to the Terms",
      description: [
        "7.1. We may update these Terms from time to time. It is your responsibility to review these Terms periodically.",
      ],
    },
    {
      title: "8. Miscellaneous",
      description: [
        "8.1. These Terms constitute the entire agreement between you and the Service.",
        "8.2. If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.",
      ],
    },
  ],
  footer: [
    "By using the Service, you acknowledge that you have read and understood these Terms and agree to abide by them. If you do not agree with these Terms, please do not use the Service.",

    "If you have any questions or concerns regarding these Terms, please contact us at mailto:support@mygpt.fi",
  ],
};

const TermsAndConditions = () => {
  return (
    <ScrollableArea className="mx-0 my-3 !h-[650px] md:mx-10 md:my-12">
      <div className="text-secondary flex flex-col gap-4">
        <p className="text-center text-xl font-bold">{data.title}</p>
        <p>{data.description}</p>
        <div className="flex flex-col gap-2">
          {data.items.map((item, key) => (
            <div key={key} className="flex flex-col gap-1">
              <p className="text-lg font-semibold">{item.title}</p>
              {item.description.map((el, id) => (
                <p key={id}>&nbsp;&nbsp;&nbsp;&nbsp;{el}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </ScrollableArea>
  );
};

export default TermsAndConditions;
