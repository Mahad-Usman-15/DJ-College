'use client';
import fire1 from '../../images/fire1.jpg' 
import fire3 from '../../images/fire2.jpg' 
import fire2 from '../../images/fire3.jpg' 
import ng2 from '../../images/ng2.jpg' 
import ptm3 from '../../images/ptm3.jpg' 
import ng3 from '../../images/ng3.jpg'
import ptm1 from '../../images/ptm1.jpg'
import ptm2 from '../../images/ptm2.jpg'
import Image from 'next/image';

export default function EventsPage() {
  const events = [
    {
      id: 1,
      title: 'Parent Teacher Meeting',
      description:
        'The Parent–Teacher Meeting provides an opportunity for meaningful dialogue between parents and faculty regarding student progress and development. It strengthens collaboration to ensure academic excellence and personal growth. The session fosters transparency, guidance, and a shared commitment to student success.',
      images: [
        fire1,
        fire2,
        fire3
      ]
    },
    {
      id: 2,
      title: 'National Games ',
      description:
        'The National Games celebrate athletic talent, teamwork, and sportsmanship among students from diverse institutions. Participants compete in various sporting events that promote discipline, resilience, and unity. The event reflects the college’s dedication to physical education and competitive excellence.',
      images: [
        ng2,ng3
      ]
    },
    {
      id: 3,
      title: 'Fire Drill',
      description:
        'The Fire Safety Event focuses on educating students and staff about emergency preparedness and response procedures. Through practical demonstrations and guided drills, participants learn essential safety protocols. The initiative reinforces the college’s commitment to maintaining a secure and responsible campus environment.',
      images: [
        ptm1,ptm2,ptm3
      ]
    }
  ];

  return (
    <div className="bg-white">
      {/* Top Description Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">College Events & Activities</h1>
          <div className="w-20 h-1 bg-green-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our college organizes a diverse range of academic, cultural, sports, and community engagement events throughout the year. These activities are designed to enhance student growth, foster creativity, build leadership skills, and strengthen the sense of community on campus. From science competitions to sports tournaments and cultural festivals, we provide platforms for students to showcase their talents and pursue their passions while creating unforgettable memories with peers and mentors.
          </p>
        </div>
      </section>

      {/* Event Sections */}
      {events.map((event) => (
        <section key={event.id} className="py-16 px-4 bg-gray-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">{event.title}</h2>
            <div className="w-16 h-1 bg-green-600 mb-6"></div>
            <p className="text-gray-700 text-lg mb-12 leading-relaxed max-w-2xl">
              {event.description}
            </p>

            {/* Image Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {event.images.map((image, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative overflow-hidden h-64 md:h-56">
                    <Image
                      src={image}
                      alt={`${event.title} image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Closing Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Community</h2>
          <p className="text-gray-700 text-lg">
            Participate in upcoming events and be part of an enriching college experience. Whether you're interested in academics, sports, arts, or community service, there's something for everyone. Check back regularly for event announcements and registration details.
          </p>
        </div>
      </section>

      {/* <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
      `}</style> */}
    </div>
  );
}
