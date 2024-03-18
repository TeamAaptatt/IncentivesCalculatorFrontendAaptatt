import React, { useState } from 'react';
import { BASE_URL } from '../../../../constants/api';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import useUserManagement from '../../../../utils/hooks/useUserMangement';

const AddPlacementButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    candidate: '',
    client: '',
    offeredPosition: '',
    dateOfJoining: '',
    cnadidateOwner: '',
    accountManager: '',
    accountHead: '',
    pandLhead: '',
    resumeSource: '',
    billableSalary: '',
    commercial: '',
    fee: '',
    sendOff: '',
    securityPeriod: '',
    paymentStaus: '',
  });
  const token = useSelector((state) => state.auth.token.token);
  const { users } = useUserManagement();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        BASE_URL + 'add-placement',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Placement created successfully');
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
      console.error('Failed to create placement');

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
        <div className="fixed inset-0 m-8 flex items-center justify-center">
          <div className="bg-white w-full md:max-w-[60rem] p-4 md:p-8 rounded-md shadow-lg overflow-y-auto max-h-full">
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 fixed translate-x-[54rem] text-red-600 border-2 border-black p-1 hover:text-gray-800 focus:outline-none"
            >
              <FontAwesomeIcon icon={faClose} />
            </button>
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-blue-500">
              Add Placement
            </h2>

            <form
              onSubmit={handleSubmit}
              className="flex flex-wrap gap-6 uppercase"
            >
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
                  ) : key === 'securityPeriod' || key === 'paymentStaus' ? (
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
                  ) : key === 'cnadidateOwner' || key === 'accountManager' || key === 'accountHead' || key === 'pandLhead' ? (
                    <select
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      className="p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-500"
                    >
                      <option value="">Select {key}</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name}
                        </option>
                      ))}
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

              <div className="m-8 flex justify-center items-center w-full">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPlacementButton;
