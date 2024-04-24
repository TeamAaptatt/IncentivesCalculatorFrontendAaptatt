import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../../../../../constants/api'
import { useSelector } from 'react-redux';
import { formatDateForInput } from '../../../../../utils/helpers/formatDateforInput';

const EmplyeeStatus = ({cid}) => {
    const token = useSelector((store) => store.auth?.token?.token);
    const [reporting, setReporting] = useState(false);
    const [isActive, setIsActive] = useState(true); 
    const [endDate, setEndDate] = useState();
    const [error, setError] = useState('');
    const [statusData, setStatusData] = useState(null);
    useEffect(()=>{
          getLatestReporing();
          getStatusOfEmployee();
    }, []);

    const getLatestReporing = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/latest-reporting/${cid}`, {
                headers: {'Authorization': `Bearer ${token}`}}) 

             const  data = response.data;
             setReporting(data);
             console.log(data);

        } catch (error) {
            console.log(error);
        }
       
    }

   const getStatusOfEmployee = async () =>{
    try {
        const response = await axios.get(`${BASE_URL}/get-termination-date/${cid}`, {
            headers: {'Authorization': `Bearer ${token}`}});
        const data = await response.data;
        setStatusData(data);
        console.log(data);
        if(data.status === "Left"){
            setIsActive(false);
        }
    } catch (error) {
        console.log(error);
    }
   }

    const handleUpdate = async () =>{
      try {
        if (!endDate) {
            setError("End date is required.");
            return;
        }

        // Check if status has changed
        if (isActive) {
            setError("Status has not changed.");
            return;
        }

        const response = await axios.put(`${BASE_URL}/updated-endDate/${cid}`, {
            id:reporting._id,
            endDate:endDate,
            status: isActive ? "Active" : "Left"
        },{
            headers:{
               "Authorization":`Bearer ${token}`
            }
        })

        getLatestReporing();
      } catch (error) {
        console.log(error);
      }
    }


    
  return (
    <div className='flex relative '>
    
        <div className=' shadow-md rounded-md border mx-8  relative h-64  cursor-pointer transition duration-300 ease-in-out transform hover:scale-105'>
        <div className='flex mt-6  '>
        <span className='font-medium uppercase text-lg mx-6'>Change Status </span>

      <label className="relative inline-block w-14 h-8">
                <input type="checkbox"   disabled={statusData?.status==='Left'}
 checked={isActive} onChange={()=>setIsActive(prev=>!prev)} className="opacity-0 w-0 h-0" />
                <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-colors duration-300 ease-in-out ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <span className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${isActive ? 'translate-x-6' : 'translate-x-0'}`}></span>
                </span>
            </label>
            <span className=" font-medium ml-6 mr-12">{isActive ? 'Active' : 'Left'}</span>
        
        </div>  
   {isActive?(<>
    <div className='flex mt-2'>
          <span className="mx-6  text-lg  font-medium block uppercase "> Reporting To </span>
          <h2 className=' mx-4 text-purple-800   text-lg  font-medium block uppercase  '>{reporting?.reportingTo?.name}</h2>
          
           
            
        </div>  
        <div className=' flex mt-2 justify-between '>
          <span className="mx-6 block uppercase font-medium text-lg"> From </span>
          <input type='date' aria-disabled value={formatDateForInput(reporting?.startDate)} className=' text-black font-bold ml-6  '/>
          </div>
        <div className='flex gap-2 mt-2'>    
        <span className=" mx-6  text-lg  font-medium block uppercase">
                         End Date
                        </span>
           <input type='date'className=' text-black font-bold ml-12' value={formatDateForInput(endDate)} onChange={(e)=>{
            setError('')
            setEndDate(e.target.value)}} />
           </div>
           {error && <p className="text-red-500 text-sm mx-6">{error}</p>}

           <button className='hover:bg-[#2399D0] bg-[#02131e] bottom-0 right-0 absolute  outline outline-1 rounded-md w-auto text-white font-semibold p-2 m-2 ' onClick={()=>handleUpdate()}>
            Terminate
           </button>
   </>):(
    <>
    <h2>
    <span className="mx-6 block uppercase font-medium text-lg"> From </span>
          <input type='date' aria-disabled value={formatDateForInput(statusData?.statuschangedate)} className=' text-black font-bold ml-6  '/>
    </h2>
    </>
   )}

        </div>

    </div>
  )
}

export default EmplyeeStatus;