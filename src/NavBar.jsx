import React, { useState, useEffect } from 'react';

import './Navbar.css';
import DocumentUploadModal from './DocumentUploadModal'
const Navbar = ({ activeIndex, setActiveIndex,fetchChats }) => {
    // State to manage the list of indexes and selected index
    const [index_names, setIndexNames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newIndexName, setNewIndexName] = useState('');
    const [createError, setCreateError] = useState(null);

    const [isCreating, setIsCreating] = useState(false);
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

    


    const handleCreateIndex = async (e) => {
        e.preventDefault();

        
        // Basic validation
        if (!newIndexName.trim()) {
          setCreateError('Index name cannot be empty');
          return;
        }
        setIsCreating(true);
        
        
    
        try {
          
          // Make POST request to create index
          const response = await fetch('https://backend-service-640388342610.us-central1.run.app/createindex', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json' // Set the content type to JSON
            },
            body: JSON.stringify({ index_name: newIndexName.trim() }) // Convert the body to a JSON string
          });
          
          // Parse the response JSON if needed
          const data = await response.json();
          if (!response.ok) {
            // If response is not successful, throw an error with the message
            throw new Error(data.message || 'Failed to create index');
          }
          // Update indexes list
          setIndexNames(prevIndexes => [...prevIndexes, newIndexName.trim()]);
          setActiveIndex(newIndexName.trim());
    
          // Close modal and reset form
          setIsModalOpen(false);
          setNewIndexName('');
          setCreateError(null);
        } catch (err) {
          console.error('Error creating index:', err);
          setCreateError(err.response?.data?.message || 'Failed to create index');
        }
        finally{
            setIsCreating(false);
            localStorage.clear();
            fetchChats();

            
        }
      };


    // Fetch indexes when component mounts
    useEffect(() => {
        const fetchIndexes = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("https://backend-service-640388342610.us-central1.run.app/getindexes")
                const data = await response.json();
                const fetchedIndexes = data['Indexes']

                // Update state with fetched indexes
                setIndexNames(fetchedIndexes);

                // Set the first index as default if exists
                // if (fetchedIndexes.length > 0) {
                //     setActiveIndex(fetchedIndexes[0])


                // }
            } catch (err) {
                console.error('Error fetching indexes:', err);
                setError('Failed to load indexes');
            } finally {
                setIsLoading(false);
            }
        };

        fetchIndexes();
    }, []);

    // Render loading state
    if (isLoading) {
        return (
            <nav className="vs-code-navbar">
                <div className="navbar-left">
                    <div className="index-dropdown-container">
                        <select className="index-dropdown" disabled>
                            <option>Loading indexes...</option>
                        </select>
                    </div>
                </div>
            </nav>
        );
    }

    // Render error state
    if (error) {
        return (
            <nav className="vs-code-navbar">
                <div className="navbar-left">
                    <div className="index-dropdown-container">
                        <select className="index-dropdown error" disabled>
                            <option>{error}</option>
                        </select>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <>
        <nav className="vs-code-navbar">
            <div className="navbar-left">
                <div className="index-dropdown-container">
                    <select
                        className="index-dropdown"
                        value={activeIndex}
                        onChange={(e) => {setActiveIndex(e.target.value); localStorage.clear(); fetchChats()}}
                    >
                        {index_names.map((name, index) => (
                            <option key={index} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                    <div className="dropdown-icon">▼</div>
                </div>
            </div>
            <div className="navbar-right">
                <button className="navbar-btn"  onClick={() => setIsModalOpen(true)}>
                    <i className="icon">Create Index</i>
                    
        
                </button>
                <button className="navbar-btn" onClick={()=>setIsDocumentModalOpen(true)}>
                    <i className="icon">Add Documents</i>
                </button>
            </div>
        </nav>
        <DocumentUploadModal 
            isOpen={isDocumentModalOpen}
            onClose={() => setIsDocumentModalOpen(false)}
            indexNames={index_names}  // Pass the list of indexes
        />

        {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Create New Index</h2>
              <button 
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
                disabled={isCreating}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateIndex} className="modal-form">
              <div className="form-group">
                <label htmlFor="indexName">Index Name</label>
                <input 
                  type="text"
                  id="indexName"
                  value={newIndexName}
                  onChange={(e) => setNewIndexName(e.target.value)}
                  placeholder="Enter index name"
                  disabled={isCreating}
                />
                {createError && (
                  <div className="error-message">{createError}</div>
                )}
              </div>
              <div className="modal-actions">
                <button 
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-create"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <div className="loader">
                      <div className="spinner"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
    );
};

export default Navbar;