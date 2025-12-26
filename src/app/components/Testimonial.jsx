import React from "react";

const testimonials = [
  {
    name: "Sarah K.",
    course: "Digital Marketing Mastery",
    text: "This course completely changed how I approach marketing. The lessons are clear, practical, and easy to follow. I landed my dream job within months!",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
  },
  {
    name: "James L.",
    course: "Python for Beginners",
    text: "I had zero coding experience, and now I can build real projects confidently. The support from instructors was amazing.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
  },
  {
    name: "Maria P.",
    course: "Graphic Design Essentials",
    text: "The design exercises were fun and practical. My portfolio looks professional, and I’m now freelancing full-time!",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
  },
];

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-white rounded-sm border border-gray-200 p-4 flex flex-col items-center text-center hover:bg-gray-100">
      <img
        src={testimonial.img}
        alt={testimonial.name}
        className="w-22 h-22 rounded-full object-cover mb-4"
      />
      <h3 className="text-lg font-semibold">{testimonial.name}</h3>
      <p className="text-sm text-gray-500 mb-3">{testimonial.course}</p>
      <p className="text-[14px] text-gray-700">{testimonial.text}</p>
    </div>
  );
};

const Testimonial = () => {
  return (
    <section id="Testimonial" className="py-16 px-4 md:px-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-2">What Our Learners Say</h2>
        <p className="text-gray-600">Real experiences from learners who transformed their skills.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {testimonials.map((t, index) => (
          <TestimonialCard key={index} testimonial={t} />
        ))}
      </div>
      <div className="text-center mt-12">
        <button className="text-black px-8 py-3 border border-gray-300 rounded-sm hover:bg-gray-100 transition">
          Enroll Now
        </button>
      </div>
    </section>
  );
};

export default Testimonial;
