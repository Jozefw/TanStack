import {useState} from 'react';
import { Link, Outlet, useParams, useNavigate } from 'react-router-dom';
import { useQuery,useMutation } from '@tanstack/react-query';
import { fetchEvent,deleteEvent,queryClient } from '../../util/http.js';
import Modal from '../UI/Modal.jsx';

import Header from '../Header.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EventDetails() {
  const [isDeleting,setIsDeleting] = useState(false); 
  const params = useParams();
  const navigate = useNavigate();
  const {data,isPending,isError,error} = useQuery({
    queryKey:['events',params.id],
    queryFn:({signal})=> fetchEvent({signal,id:params.id})
  })

  const {mutate, isPending:isPendingDeletion, 
    isError: isErrorDeletion, 
    error: errorDeletion} = useMutation({
    mutationFn: deleteEvent,
    onSuccess: ()=>{
      queryClient.invalidateQueries({
        queryKey:['events'],
        refetchType:'none'
      })
        navigate('/events')
    }
  });

  function handleStartDelete(){
    setIsDeleting(true);
  }
  function handleStopDelete(){
    setIsDeleting(false);
  }
  function handleDelete(){
    mutate({id:params.id});
  }
  let content;

  if(isPending){
    content = (
    <div id="event-details-content" className="center">
      <p>...retrieving data...</p>
    </div>
    );
  }

  if(isError){
    content=(
      <div id="event-details-content" className="center">
      <ErrorBlock title ="Event Loading Failure" message = {error.info?.message || "Failed to fetch error message"}></ErrorBlock>
    </div>
    )
  }

  if(data){
    content = (
      <>
      {isDeleting && (
      <Modal onClose={handleStopDelete}>
      <h2>Verify Delete</h2>
      <p>... Delete Can Not Be Undone...</p>
      <div className="form-actions">
        {isPendingDeletion && <p>... Completing Deletion, One Moment ...</p>}
        {!isPendingDeletion && (<>
        <button onClick={handleStopDelete} className = "button-text">Cancel</button>
        <button onClick={handleDelete} className = "button">Delete</button>
        </>)}
      </div>
      {isErrorDeletion && <ErrorBlock title="Deletion Failure" message={errorDeletion.info?.message || "Failed to delete"}>
        </ErrorBlock>}
      </Modal>
      )}
      <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleStartDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
      <div id="event-details-content">
      <img src={`https://35.171.4.129/:3030/${data.image}`} alt={data.title} />
      <div id="event-details-info">
        <div>
          <p id="event-details-location">{data.location}</p>
          <time dateTime={`Todo-DateT$Todo-Time`}>{data.date} @ {data.time}</time>
        </div>
        <p id="event-details-description">{data.description}</p>
      </div>
    </div>
      </>
    )
  }
  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        {content}
      </article>
    </>
  );
}
