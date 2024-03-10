import React,{useState,useEffect} from "react";
import CardComponent from "./CardComponent";
import axios from "axios";

interface User{
    id :number;
    name: string;
    email: string;
}

interface UserInterfaceProps {
   backendname : string;
}

const UserInterface : React.FC<UserInterfaceProps> = ({backendname}) =>{

   const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
   const [users,setUsers] = useState<User[]>([]);
   const [newUser, setNewUser] = useState({name: "",email: ""});
   const [updateUser, setUpdateUser] = useState({ id: '', name: '', email: '' });
   const [isUpdating, setIsUpdating] = useState(false);

   useEffect(() => {
    const fetchData = async ()=>{
        try {
            const response = await axios.get(`${apiUrl}/api/${backendname}/users`);
            setUsers(response.data.reverse());
        }
        catch (error){
            console.error("Error while fetching data",error);
        } 
    };

    fetchData();

   },[backendname,apiUrl]);

  const createUser = async (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    try{
        const response = await axios.post(`${apiUrl}/api/${backendname}/users`,newUser);
        setUsers([response.data, ...users]);
        setNewUser({name:'',email:''});
    }
    catch (error) {
        console.log("Error while creating user",error);
    }
  };


  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) =>{ 
    e.preventDefault();
    try{
        const response = await axios.put(`${apiUrl}/api/${backendname}/users/${updateUser.id}`,{name:updateUser.name, email: updateUser.email});
        setUpdateUser({id:'', name: '', email:''});
        setUsers(
            users.map((user) => {
                if(user.id === parseInt(updateUser.id)){
                    return {...user, name:updateUser.name, email:updateUser.email};
                }
                return user;

            })
        );
    }
    catch (error) {
        console.error('Error while updating user:', error);

    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isUpdating) {
      handleUpdateUser(e);
    } else {
      createUser(e);
    }
  };
  

  const deleteUser = async (userId :number) => {
    try {
        await axios.delete(`${apiUrl}/api/${backendname}/users/${userId}`);
        setUsers(users.filter((user) => user.id !== userId));
    }
    catch (error) {
        console.error('Error deleting user:', error);

    }
  }
  
  const handleToggleUpdate = () => {
    setIsUpdating(!isUpdating);
    setNewUser({ name: '', email: '' });
    setUpdateUser({ id: '', name: '', email: '' });
  };

  return (
   <>
     <button onClick={handleToggleUpdate} className="mt-3 mb-2 smb-4 p-2 text-white bg-[#050708] rounded hover:bg-blue-600">
             {isUpdating ? "Add User" : "Update User"}
      </button>
      <form onSubmit={handleSubmit} className="pt-50 w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
      <h5 className="text-xl font-medium ml-5 text-gray-900 dark:text-white mb-4 ">Add userto our platform</h5>
      <input
        placeholder={isUpdating ? "User ID" : "Name"}
        value={isUpdating ? updateUser.id : newUser.name}
        onChange={(e) => isUpdating ? setUpdateUser({ ...updateUser, id: e.target.value }) : setNewUser({ ...newUser, name: e.target.value })}
        className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
      />
      {!isUpdating && (
        <input
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        />
      )}
      {isUpdating && (
        <>
          <input
            placeholder="New Name"
            value={updateUser.name}
            onChange={(e) => setUpdateUser({ ...updateUser, name: e.target.value })}
            className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          />
          <input
            placeholder="New Email"
            value={updateUser.email}
            onChange={(e) => setUpdateUser({ ...updateUser, email: e.target.value })}
            className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          />
        </>
      )}
      <button type="submit" className="mt-5 w-full p-2 text-white bg-blue-500 rounded hover:bg-green-600">
        {isUpdating ? "Update User" : "Add User"}
      </button>
    </form>

    <div className="mt-8 space-y-4 overflow-y-auto max-h-80">
      {users.map((user) => (
        <div key={user.id} className="relative flex items-center justify-between w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            {/* Display user information */}
            <CardComponent card={user} />
          </div>
          {/* Delete button */}
          <button
            className="absolute top-15 right-2 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            onClick={() => deleteUser(user.id)}
          >
            Delete User
          </button>
        </div>
      ))}
    </div>
   </>
  );



}

export default UserInterface;