import { Button, Label, Textarea, TextInput } from "flowbite-react";
import { useState } from "react";

export default function Contact() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="h-screen w-full max-w-lg p-8 bg-white rounded-lg shadow-xl" style={{maxHeight: '85vh'}}>
        <h2 className="text-2xl font-bold mb-6">CONTACT US</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6 mt-3">
            <Label htmlFor="email" className="mb-2 block" style={{color: 'black'}}>
              Your Email
            </Label>
            <TextInput
              id="email"
              name="email"
              placeholder="name@company.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="subject" className="mb-2 block" style={{color: 'black'}}>
              Subject
            </Label>
            <TextInput
              id="subject"
              name="subject"
              placeholder="Let us know how we can help you"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="message" className="mb-2 block" style={{color: 'black'}}>
              Your message
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Your message..."
              rows={4}
              style={{height: 175, maxHeight: 180, minHeight: 40}}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <Button type="submit" className="w-full">
              Send message
            </Button>
          </div>
        </form>
        <div className="text-sm text-gray-500">
          <p>
            <a href="mailto:as2041909@gmail.com" className="hover:underline">
              as2041909@gmail.com
            </a>
          </p>
          {/* <p>
            <a href="tel:2124567890" className="hover:underline">
              212-456-7890
            </a>
          </p> */}
        </div>   
      </div>
    </div>
  );
}
