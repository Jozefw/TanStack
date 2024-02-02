import { Link } from 'react-router-dom';

import meetupImg from '../../assets/meetup.jpg';

export default function EventsIntroSection() {
  return (
    <section
      className="content-section"
      id="overview-section"
      style={{ backgroundImage: `url(${meetupImg})` }}
    >
      <h2>
        Connect with amazing people <br />
        and <strong>relive the 80's</strong>
      </h2>
      <p>
        <Link to="/events/new" className="button">
          Create your first event
        </Link>
      </p>
    </section>
  );
}
