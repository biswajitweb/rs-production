import React from 'react'

export default function HeaderSearch({
    isShow = false
}) {
    return (
        <>
        {
            isShow &&
              <li>
                <div className='header-search'>
                        <div className="input-wrap">
                            <input placeholder="Search..." data-mobile-placeholder="Search photos..." autocomplete="off" type="text" value="" name="search" />
                            <button type="button" className="btn-search" aria-label="Search photos"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"></path></svg></button>
                            </div>
                </div>
            </li>
        }
           
        </>
    )
}
