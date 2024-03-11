import React, { useState } from 'react';
import { BASE_URL } from '../../../../constants/api';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddPlacementButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    candidate: '',
    client: '',
    offeredPosition: '',
    dateOfJoining: '',
    candidateOwner: '',
    accountManager: '',
    accountHead: '',
    pandLhead: '',
    resumeSource: '',
    billableSalary: '',
    commercial: '',
    fee: '',
    sendOff: '',
    securityPeriod: '',
    paymentStatus: '',
  });
  const token = useSelector((state) => state.auth.token.token);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(BASE_URL +'add-placement', formData,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        // Handle successful placement creation
        console.log('Placement created successfully');
        // Optionally, close the modal or reset the form
        setIsModalOpen(false);
        setFormData({
          status: '',
          candidate: '',
          client: '',
          offeredPosition: '',
          dateOfJoining: '',
          candidateOwner: '',
          accountManager: '',
          accountHead: '',
          pandLhead: '',
          resumeSource: '',
          billableSalary: '',
          commercial: '',
          fee: '',
          sendOff: '',
          securityPeriod: '',
          paymentStatus: '',
        });
      } else {
        // Handle error in placement creation
        console.error('Failed to create placement');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
      >
        Add Placement
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white w-full md:max-w-md p-4 md:p-8 rounded-md shadow-lg overflow-y-auto max-h-full">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-blue-500">Add Placement</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key.replace(/([a-z])([A-Z])/g, '$1 $2')}:
                  </label>
                  {key === 'dateOfJoining' ? (
                    <input
                      type="date"
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      className="p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-500"
                    />
                  ) : key === 'securityPeriod' || key === 'paymentStatus' ? (
                    <select
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      className="p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-500"
                    >
                      {key === 'securityPeriod' ? (
                        ['On-Going', 'Completed', 'Send-Off'].map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))
                      ) : (
                        ['Pending', 'Received', 'Adjusted', 'Returning', 'Compromised'].map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))
                      )}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      className="p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-500"
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                >
                  Submit
                </button>
              </div>
            </form>

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPlacementButton;
