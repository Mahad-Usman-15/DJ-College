'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FAQPageSchema } from '../components/schema';
import { eventsData } from '../data/events';

export default function EventsPage() {
  const events = eventsData;

  const sectionVariant = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  const imageContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const imageVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="bg-white">
      {/* Schema markup for the events page */}
      <FAQPageSchema 
        mainEntity={[
          {
            '@type': 'Question',
            name: 'What events does the college organize?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The college organizes diverse events including Parent-Teacher Meetings, National Games, Fire Drills, and other academic and cultural activities.'
            }
          },
          {
            '@type': 'Question',
            name: 'How do events benefit students?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Events enhance student growth, foster creativity, build leadership skills, and strengthen the sense of community on campus.'
            }
          }
        ]}
      />
      
      {/* Top Description Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariant}
        className="py-16 px-4"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            College Events & Activities
          </h1>
          <div className="w-20 h-1 bg-green-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our college organizes a diverse range of academic, cultural, sports,
            and community engagement events throughout the year. These activities
            are designed to enhance student growth, foster creativity, build
            leadership skills, and strengthen the sense of community on campus.
          </p>
        </div>
      </motion.section>

      {/* Event Sections */}
      {events.map((event) => (
        <motion.section
          key={event.id}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariant}
          className="py-16 px-4 bg-gray-50 border-b border-gray-200"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              {event.title}
            </h2>
            <div className="w-16 h-1 bg-green-600 mb-6"></div>
            <p className="text-gray-700 text-lg mb-12 leading-relaxed max-w-2xl">
              {event.description}
            </p>

            {/* Image Grid */}
            <motion.div
              variants={imageContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {event.images.map((image, index) => (
                <motion.div
                  key={index}
                  variants={imageVariant}
                  className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative overflow-hidden h-64 md:h-56">
                    <Image
                      src={image}
                      alt={`${event.title} image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      ))}

      {/* Closing Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-16 px-4 bg-white"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join Our Community
          </h2>
          <p className="text-gray-700 text-lg">
            Participate in upcoming events and be part of an enriching college
            experience.
          </p>
        </div>
      </motion.section>
    </div>
  );
}
