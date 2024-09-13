import { useState, useEffect } from 'react';
import Card from './Card';
import Loader from './Loader';

function News() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  function handlePrev() {
    setPage(page - 1);
  }

  function handleNext() {
    setPage(page + 1);
  }

  const pageSize = 12;

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetch(`${API_URL}/?page=${page}&pageSize=${pageSize}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return response.text().then(text => {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Response text: ${text}`);
          });
        }
      })
      .then(myJson => {
        if (myJson.success) {
          setTotalResults(myJson.data.totalResults);
          setData(myJson.data.articles);
        } else {
          setError(myJson.message || 'An error occurred');
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setError(error.message || 'Failed to fetch news. Please try again later.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page]);

  return (
    <>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className='my-10 cards grid lg:place-content-center md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xs:grid-cols-1 xs:gap-4 md:gap-10 lg:gap-14 md:px-16 xs:p-3'>
        {!isLoading ? data.map((element, index) => (
          <Card
            title={element.title}
            description={element.description}
            imgUrl={element.image} // Ensure this matches the API response field
            publishedAt={element.publishedAt}
            url={element.url}
            author={element.author}
            source={element.source?.name || "Unknown Source"}
            key={index}
          />
        )) : <Loader />}
      </div>
      {!isLoading && data.length > 0 && (
        <div className="pagination flex justify-center gap-14 my-10 items-center">
          <button 
            disabled={page <= 1} 
            className='pagination-btn text-center' 
            onClick={handlePrev}
          >
            &larr; Prev
          </button>
          <p className='font-semibold opacity-80'>{page} of {Math.ceil(totalResults / pageSize)}</p>
          <button 
            className='pagination-btn text-center' 
            disabled={page >= Math.ceil(totalResults / pageSize)} 
            onClick={handleNext}
          >
            Next &rarr;
          </button>
        </div>
      )}
    </>
  );
}

export default News;
